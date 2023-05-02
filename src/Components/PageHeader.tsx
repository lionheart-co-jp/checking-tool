import React from "react";
import styled from "@emotion/styled";

// Components
import { PageHeader as AntdPageHeader } from "@ant-design/pro-layout";
const Description = styled.p({
    marginTop: -14,
    color: `rgba(0, 0, 0, 0.45)`,
});

type Props = {
    primary?: React.ReactNode;
    secondary?: React.ReactNode;
    children?: React.ReactNode;
};
export const PageHeader: React.FC<Props> = ({
    primary,
    secondary,
    children,
}) => {
    return (
        <AntdPageHeader title={primary}>
            {secondary && <Description>{secondary}</Description>}
            {children}
        </AntdPageHeader>
    );
};
