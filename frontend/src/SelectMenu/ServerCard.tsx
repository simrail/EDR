import React from "react";
import {Card} from "flowbite-react";
import {StringParam, useQueryParam} from "use-query-params";

export const ServerCard: React.FC<any> = ({server}) => {
    const [_, setServerParam] = useQueryParam('serverCode', StringParam);
    return (
        <Card className="m-4 cursor-pointer" onClick={() => {
            setServerParam(server.ServerCode);
            window.history.go();
        }}>
            {server.ServerName}
        </Card>
    )
}