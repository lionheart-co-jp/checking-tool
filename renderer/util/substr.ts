export default function (
    text: string,
    len: number,
    truncation: string = "..."
) {
    let count = 0;
    const str: string[] = [];

    text.split("").some((s) => {
        const n = escape(s);
        if (n.length < 4) {
            count += 1;
        } else {
            count += 2;
        }

        if (count > len) {
            str.pop();
            str.push(truncation);
            return true;
        } else {
            str.push(s);
            return false;
        }
    });

    return str.join("");
}
