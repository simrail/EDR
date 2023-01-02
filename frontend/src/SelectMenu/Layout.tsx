import React from "react";
import {Button, Navbar} from "flowbite-react";
import AppLogo from "../logo.png";
import Background from "./background.jpg";
import {useTranslation} from "react-i18next";

export const SelectMenuLayout: React.FC<any> = ({children, title}) => {
    const {t, i18n} = useTranslation();

    return <div className="text-primary">
        <Navbar fluid={true} className="bg-slate-300 sticky top-0">
            <Navbar.Brand href="/">
                <img src={AppLogo} height={64} width={64}/>
                <span className="ml-4">EDR</span>
            </Navbar.Brand>
            <div className="flex">
                <Button color={i18n.language === "fr" ? "info" : "gray"} className="ml-8 mx-2" onClick={() => i18n.changeLanguage("fr")}>FR</Button>
                <Button disabled color={i18n.language === "en" ? "info" : "gray"} onClick={() => i18n.changeLanguage("en")}>EN</Button>
                <Button disabled color={i18n.language === "cz" ? "info" : "gray"} className="mx-2" onClick={() => i18n.changeLanguage("cz")}>CZ</Button>

            </div>

        <Navbar.Collapse>
                <Navbar.Link href="https://github.com/DKFN" target="_blank">
                    DKFN
                </Navbar.Link>
                <Navbar.Link href="https://simrail.fr/discord" target="_blank">
                    Simrail France
                </Navbar.Link>
                <Navbar.Link href="https://discord.gg/ofpmafia" target="_blank">
                    OFPmafia
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
            {t("footer.version")} 0.4 - {t("footer.screenshots_by")} - {t("footer.thanks")} ❤️
        </div>
    </div>;
}