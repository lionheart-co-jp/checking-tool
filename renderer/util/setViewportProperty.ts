const customViewportCorrectionVariable = "vh";
const navHeightVariable = "nh";

function setViewportProperty(doc) {
    let prevClientHeight;

    const customVar = "--" + (customViewportCorrectionVariable || "vh");
    const navHeightVar = "--" + (navHeightVariable || "nh");

    const handleResize = () => {
        const clientHeight = doc.clientHeight;
        if (clientHeight === prevClientHeight) return;

        window.requestAnimationFrame(function updateViewportHeight() {
            doc.style.setProperty(customVar, `${clientHeight * 0.01}px`);

            const nav = document.querySelector("#header");
            if (nav) {
                const rect = nav.getBoundingClientRect();
                doc.style.setProperty(navHeightVar, `${rect.height}px`);
            } else {
                doc.style.setProperty(navHeightVar, "0px");
            }

            prevClientHeight = clientHeight;
        });
    };
    handleResize();

    return handleResize;
}

export default () => {
    window.addEventListener(
        "resize",
        setViewportProperty(document.documentElement)
    );
};
