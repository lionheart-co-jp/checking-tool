//go:generate go run -tags generate gen.go

package main

import (
	"os"
	"os/user"

	"bufio"
	"encoding/base64"
	"fmt"
	"io/ioutil"
	"log"
	"net"
	"net/http"
	"net/url"

	"github.com/PuerkitoBio/goquery"
	"github.com/zserge/lorca"
)

type RequestOption struct {
	user string
	pass string
}

/**
 * UtilRequest
 */
func UtilRequest(url string, option RequestOption) (res *http.Response, err error) {
	req, _ := http.NewRequest("GET", url, nil)

	if option.user != "" && option.pass != "" {
		auth := option.user + ":" + option.pass
		req.Header.Set("Authorization", "Basic "+base64.StdEncoding.EncodeToString([]byte(auth)))
	}

	client := new(http.Client)
	res, err = client.Do(req)
	if err != nil {
		log.Print(err)
		return nil, err
	}
	if res.StatusCode != 200 {
		log.Printf("status code error: %d %s", res.StatusCode, res.Status)
		return nil, fmt.Errorf("status code error: %d %s", res.StatusCode, res.Status)
	}

	return res, nil
}

/**
 * UtilUrlToBase64
 */
func UtilUrlToBase64(url string) string {
	res, err := UtilRequest(url, RequestOption{})
	if err != nil {
		log.Print(err)
		return ""
	}
	defer res.Body.Close()

	// ContentType
	contentType := res.Header.Get("content-type")

	// Read entire JPG into byte slice.
	reader := bufio.NewReader(res.Body)
	content, _ := ioutil.ReadAll(reader)

	// Encode as base64.
	encodedImage := base64.StdEncoding.EncodeToString(content)

	return "data:" + contentType + ";base64," + encodedImage
}

/**
 * TitleRequest
 */
func TitleRequest(param map[string]string) (result map[string]string, resError error) {
	result = map[string]string{}

	_, userCheck := param["user"]
	_, passCheck := param["pass"]

	requestOption := RequestOption{}
	if userCheck && passCheck {
		requestOption.user = param["user"]
		requestOption.pass = param["pass"]
	}

	res, err := UtilRequest(param["url"], requestOption)
	if err != nil {
		log.Print(err)
		return result, err
	}
	defer res.Body.Close()

	doc, err := goquery.NewDocumentFromReader(res.Body)
	if err != nil {
		log.Print(err)
		return result, err
	}

	result["title"] = doc.Find("title").Eq(0).Text()

	doc.Find("meta").Each(func(_ int, s *goquery.Selection) {
		var name, hasName = s.Attr("name")
		if !hasName {
			name, hasName = s.Attr("property")
		}

		if hasName {
			result[name] = s.AttrOr("content", "")
		}
	})

	return result, nil
}

/**
 * AltRequest
 */
func AltRequest(param map[string]string) (result []map[string]string, resError error) {
	result = []map[string]string{}

	_, userCheck := param["user"]
	_, passCheck := param["pass"]

	requestOption := RequestOption{}
	if userCheck && passCheck {
		requestOption.user = param["user"]
		requestOption.pass = param["pass"]
	}

	res, err := UtilRequest(param["url"], requestOption)
	if err != nil {
		log.Print(err)
		return result, err
	}
	defer res.Body.Close()

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

		if userCheck && passCheck {
			rel.User = url.UserPassword(param["user"], param["pass"])
		}

		row["src"] = src
		row["alt"] = alt
		if hasAlt {
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
	os.MkdirAll(dir, os.ModePerm)
	ui, _ := lorca.New("", "", 1090, 600)
	defer ui.Close()

	ui.Bind("util_url_to_base64", UtilUrlToBase64)
	ui.Bind("alt_request", AltRequest)
	ui.Bind("title_request", TitleRequest)

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
