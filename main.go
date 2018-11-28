//go:generate go run -tags generate gen.go

package main

import (
    "os"
    "os/user"

    "errors"
    "bufio"
    "io/ioutil"
    "fmt"
    "log"
    "net"
    "net/url"
    "net/http"
    "encoding/base64"

    "github.com/zserge/lorca"
    "github.com/PuerkitoBio/goquery"
)

func UtilUrlToBase64(url string) string {
    req, err := http.NewRequest("GET", url, nil)

    if (err != nil) {
        return ""
    }

    client := new(http.Client)
    res, err := client.Do(req)
    if err != nil {
        log.Print(err)
        return ""
    }
    defer res.Body.Close()
    if res.StatusCode != 200 {
        log.Printf("status code error: %d %s", res.StatusCode, res.Status)
        return ""
    }

    // ContentType
    contentType := res.Header.Get("content-type")

    // Read entire JPG into byte slice.
    reader := bufio.NewReader(res.Body)
    content, _ := ioutil.ReadAll(reader)

    // Encode as base64.
    encodedImage := base64.StdEncoding.EncodeToString(content)


    return "data:" + contentType + ";base64," + encodedImage
}

func AltRequest(param map[string]string) (result []map[string]string, resError error) {
    result = []map[string]string{}

    req, _ := http.NewRequest("GET", param["url"], nil)

    _, userCheck := param["user"]
    _, passCheck := param["pass"]

    if (userCheck && passCheck) {
        auth := param["user"] + ":" + param["pass"]
        req.Header.Set("Authorization", "Basic " + base64.StdEncoding.EncodeToString([]byte(auth)))
    }

    client := new(http.Client)
    res, err := client.Do(req)
    if err != nil {
        log.Print(err)
        return result, err
    }
    defer res.Body.Close()
    if res.StatusCode != 200 {
        log.Printf("status code error: %d %s", res.StatusCode, res.Status)
        return result, errors.New(fmt.Sprintf("status code error: %d %s", res.StatusCode, res.Status))
    }

    doc, err := goquery.NewDocumentFromReader(res.Body)
    if err != nil {
        log.Print(err)
        return result, err
    }

    doc.Find("img").Each(func(i int, s *goquery.Selection) {
        row := map[string]string{}

        src, _ := s.Attr("src")
        alt, hasAlt := s.Attr("alt")

        u, _ := url.Parse(param["url"])
        rel, _ := u.Parse(src)

        if (userCheck && passCheck) {
            rel.User = url.UserPassword(param["user"], param["pass"])
        }

        row["src"] = src
        row["alt"] = alt
        if (hasAlt) {
            row["flag"] = "true"
        } else {
            row["flag"] = "false"
        }
        row["url"] = rel.String()

        result = append(result, row)
    })

    return result, nil
}

func main() {
    user, err := user.Current()
    if err != nil {
            panic(err)
    }
    dir := user.HomeDir + "/.lorca-app"
    os.MkdirAll(dir, os.ModePerm);
    ui, _ := lorca.New("", "", 1090, 600)
    defer ui.Close()

    ui.Bind("alt_request", AltRequest);
    ui.Bind("util_url_to_base64", UtilUrlToBase64)

    // Load HTML.
    // You may also use `data:text/html,<base64>` approach to load initial HTML,
    // e.g: ui.Load("data:text/html," + url.PathEscape(html))

    ln, err := net.Listen("tcp", "127.0.0.1:0")
    if err != nil {
        log.Print(err)
    }
    defer ln.Close()
    go http.Serve(ln, http.FileServer(FS))
    ui.Load(fmt.Sprintf("http://%s", ln.Addr()))

    <-ui.Done()
}