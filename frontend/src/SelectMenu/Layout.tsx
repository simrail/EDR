import React from "react";
import {Navbar} from "flowbite-react";
import AppLogo from "../logo.png";
import Background from "./background.jpg";

export const SelectMenuLayout: React.FC<any> = ({children, title}) => {

    return <div className="text-primary">
        <Navbar fluid={true} className="bg-slate-300 sticky top-0">
            <Navbar.Brand href="/">
                <img src={AppLogo} height={64} width={64}/>
                <span className="ml-4">EDR</span>
            </Navbar.Brand>
            <Navbar.Collapse>
                <Navbar.Link href="https://simrail.fr/discord" target="_blank">
                    Simrail France
                </Navbar.Link>
                <Navbar.Link href="https://github.com/DKFN" target="_blank">
                    by DeadlyKungFu.Ninja
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
        <div style={{backgroundImage: "url('"+Background+"')"}} className="h-screen">
            <h3 className="pt-8 text-center text-white text-3xl">{title}</h3>
            <div className="flex items-center justify-center max-w-screen h-full">
                <div className="mt-4 flex flex-wrap max-w-screen justify-center content-center">
            {children}
                </div>
            </div>
        </div>
        <div className="text-center mt-4">
            - version 0.1 - Screenshot par TheMulhoose
        </div>
    </div>;
}