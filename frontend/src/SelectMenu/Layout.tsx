import React from "react";
import {Navbar, Dropdown } from "flowbite-react";
import AppLogo from "../logo.png";
import Background from "./background.jpg";
import {useTranslation} from "react-i18next";
import {FR, GB, CZ, HU, DE, SK} from "country-flag-icons/react/1x1";

const DropdownFlagIcon: React.FC<any> = ({children}) =>
    <span className="h-4 w-4 mr-4">
        {children}
    </span>

export const SelectMenuLayout: React.FC<any> = ({children, title}) => {
    const {t, i18n} = useTranslation();
    return <div className="text-primary">
        <Navbar fluid={true} className="sticky top-0 bg-slate-300">
            <Navbar.Brand href="/">
                <img src={AppLogo} height={64} width={64} alt="App Logo"/>
                <span className="ml-4">EDR</span>
            </Navbar.Brand>
        <Navbar.Collapse>
            <Dropdown label={<>Language ({i18n.language.toUpperCase()})</>} inline>
                    <Dropdown.Item icon={() => <DropdownFlagIcon><FR /></DropdownFlagIcon>} onClick={() => i18n.changeLanguage("fr")}>
                        French
                    </Dropdown.Item>
                    <Dropdown.Item icon={() => <DropdownFlagIcon><GB /></DropdownFlagIcon>} onClick={() => i18n.changeLanguage("en")}>
                        English
                    </Dropdown.Item>
                    <Dropdown.Item icon={() => <DropdownFlagIcon><CZ /></DropdownFlagIcon>} onClick={() => i18n.changeLanguage("cz")}>
                        Czech
                    </Dropdown.Item>
                    <Dropdown.Item icon={() => <DropdownFlagIcon><SK /></DropdownFlagIcon>} onClick={() => i18n.changeLanguage("sk")}>
                        Slovakian
                    </Dropdown.Item>
                    <Dropdown.Item icon={() => <DropdownFlagIcon><HU /></DropdownFlagIcon>} onClick={() => i18n.changeLanguage("hu")}>
                        Hungarian
                    </Dropdown.Item>
                    <Dropdown.Item icon={() => <DropdownFlagIcon><DE /></DropdownFlagIcon>} onClick={() => i18n.changeLanguage("de")}>
                        Deutsch
                    </Dropdown.Item>
                </Dropdown>

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
            {t("footer.version")} 0.9 - {t("footer.screenshots_by")} TheMulhoose - {t("footer.thanks")} ❤️ - {t("footer.not_official")}
        </div>
    </div>;
}