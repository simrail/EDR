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
                <img src={AppLogo} height={64} width={64} alt="App Logo"/>
                <span className="ml-4">EDR</span>
            </Navbar.Brand>
            <div className="flex">
                <Button color={i18n.language.includes("fr") ? "info" : "gray"} className="mx-2" onClick={() => i18n.changeLanguage("fr")}>FR</Button>
                <Button color={i18n.language.includes("en") ? "info" : "gray"} className="mx-2" onClick={() => i18n.changeLanguage("en")}>EN</Button>
                <Button color={i18n.language.includes("cs") ? "info" : "gray"} className="mx-2" onClick={() => i18n.changeLanguage("cs")}>CZ</Button>
                <Button color={i18n.language.includes("hu") ? "info" : "gray"} className="mx-2" onClick={() => i18n.changeLanguage("hu")}>HU</Button>
                <Button color={i18n.language.includes("de") ? "info" : "gray"} className="mx-2" onClick={() => i18n.changeLanguage("de")}>DE</Button>
            </div>

        <Navbar.Collapse>
                <Navbar.Link href="https://github.com/DKFN" target="_blank">
                    DKFN
                </Navbar.Link>
                <Navbar.Link href="https://github.com/Tallyrald" target="_blank">
                    Tallyrald
                </Navbar.Link>
                <Navbar.Link href="https://github.com/DKFN/edr-issues/issues" target="_blank">
                    {t("navbar.bugs")}
                </Navbar.Link>
                <Navbar.Link href="https://simrail.fr/discord" target="_blank">
                    Simrail France
                </Navbar.Link>
                <Navbar.Link href="https://discord.gg/A63hJphHQ4">
                    SimRail Germany
                </Navbar.Link>
                <Navbar.Link href="https://discord.gg/ofpmafia" target="_blank">
                    OFPmafia
                </Navbar.Link>
                <Navbar.Link href="https://discord.com/invite/XgJpXpG2Eu" target="_blank">
                    Simrail Global
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
        <div style={{backgroundImage: "url('"+Background+"')", backgroundSize: "cover"}} className="min-h-screen">
            <h3 className="pt-8 text-center text-white text-3xl">{title}</h3>
            <div className="flex items-center justify-center max-w-screen min-h-screen">
                <div className="mt-4 flex flex-wrap max-w-screen justify-center content-center">
            {children}
                </div>
            </div>
        </div>
        <div className="text-center mt-4">
            {t("footer.version")} 0.8 - {t("footer.screenshots_by")} TheMulhoose - {t("footer.thanks")} ❤️ - {t("footer.not_official")}
        </div>
    </div>;
}