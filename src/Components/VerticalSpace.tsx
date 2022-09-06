import React from "react";
import { Space } from "antd";
import styled from "@emotion/styled";

const StyledSpace = styled(Space)({
    width: "100%",
});

type Props = React.ComponentProps<typeof Space>;
export const VerticalSpace: React.FC<Props> = ({
    children,
    direction,
    ...props
}) => {
    return (
        <StyledSpace direction={direction ?? "vertical"} {...props}>
            {children}
        </StyledSpace>
    );
};
