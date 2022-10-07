import React, { useMemo, useState } from "react";

// Components
import { Modal } from "antd";

// Atoms
import { useValue as useUrlValue } from "../Atoms/UrlResult";
import { useValue as useUserValue } from "../Atoms/UserResult";
import { useValue as usePassValue } from "../Atoms/PassResult";

type Props = React.ComponentProps<"img"> & {
    url?: string;
    image: string;
};
export const Image: React.FC<Props> = ({ url, image, style, ...props }) => {
    const savedUrl = useUrlValue();
    const user = useUserValue();
    const pass = usePassValue();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const imagePath = useMemo(() => {
        if (!image) {
            return "";
        }

        const src = new URL(image, url ?? savedUrl);

        if (src && pass) {
            src.username = user;
            src.password = pass;
        }

        return src.toString();
    }, [image, url, savedUrl, pass, user]);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return imagePath ? (
        <>
            <img
                src={imagePath}
                style={{ ...style, ...{ cursor: "pointer" } }}
                {...props}
                onClick={handleOpenModal}
            />

            <Modal
                open={isModalOpen}
                width={1000}
                footer={null}
                onCancel={handleCloseModal}
                centered
                className="imageModal">
                <img src={imagePath} style={{ maxWidth: `100%` }} />
            </Modal>
        </>
    ) : null;
};
