import React, { useMemo } from "react";

// Atoms
import { useValue as useUrlValue } from "../Atoms/UrlResult";
import { useValue as useUserValue } from "../Atoms/UserResult";
import { useValue as usePassValue } from "../Atoms/PassResult";

type Props = React.ComponentProps<"img"> & {
    image: string;
};
const Image: React.FunctionComponent<Props> = ({ image, ...props }) => {
    const url = useUrlValue();
    const user = useUserValue();
    const pass = usePassValue();

    const imagePath = useMemo(() => {
        if (!image) {
            return "";
        }

        const src = new URL(image, url);

        if (src && pass) {
            src.username = user;
            src.password = pass;
        }

        return src.toString();
    }, [image, url, pass, user]);

    return imagePath ? <img src={imagePath} {...props} /> : null;
};

export default Image;
