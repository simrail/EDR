import React from "react";
import {Navbar} from "flowbite-react/lib/esm/components/Navbar";
import {Dropdown} from "flowbite-react/lib/esm/components/Dropdown";
import AppLogo from "../images/logo.png";
import AppLogoWebp from "../images/logo.webp";
import Background from "../images/background.jpg";
import BackgroundWebp from "../images/background.webp";
import {useTranslation} from "react-i18next";
import {FR, GB, CZ, HU, DE, SK, IT} from "country-flag-icons/react/1x1";

const DropdownFlagIcon: React.FC<any> = ({children}) =>
    <span className="h-4 w-4 mr-4">
        {children}
    </span>

type Props = {
    children?: any,
    title: string,
    isWebpSupported: boolean
}

export const SelectMenuLayout: React.FC<Props> = ({children, title, isWebpSupported}) => {
    const {t, i18n} = useTranslation();
    const background = isWebpSupported ? BackgroundWebp : Background;
    const appLogo = isWebpSupported ? AppLogoWebp : AppLogo;
    return <div className="text-primary">
        <Navbar fluid={true} className="sticky top-0 bg-slate-300">
            <Navbar.Brand href="/">
                <img src={appLogo} height={64} width={64} alt="App Logo"/>
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
                    <Dropdown.Item icon={() => <DropdownFlagIcon><CZ /></DropdownFlagIcon>} onClick={() => i18n.changeLanguage("cs")}>
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
                    <Dropdown.Item icon={() => <DropdownFlagIcon><IT /></DropdownFlagIcon>} onClick={() => i18n.changeLanguage("it")}>
                        Italian
                    </Dropdown.Item>
                </Dropdown>

                <Navbar.Link href="https://github.com/DKFN" target="_blank">
                    DKFN
                </Navbar.Link>
                <Navbar.Link href="https://github.com/Tallyrald" target="_blank">
                    Tallyrald
                </Navbar.Link>
                <Navbar.Link href="https://github.com/DKFN/edr-issues/issues" target="_blank">
                    {t("NAVBAR_bugs")}
                </Navbar.Link>
                <Navbar.Link href="https://simrail.fr/discord" target="_blank">
                    Simrail France
                </Navbar.Link>
                <Navbar.Link href="https://discord.gg/A63hJphHQ4">
                    SimRail Germany
                </Navbar.Link>
                <Navbar.Link href="https://discord.gg/DztnvgePXw" target="_blank">
                    OFPmafia
                </Navbar.Link>
                <Navbar.Link href="https://discord.com/invite/XgJpXpG2Eu" target="_blank">
                    Simrail Global
                </Navbar.Link>


            </Navbar.Collapse>
        </Navbar>

        <div style={{backgroundImage: "url('"+background+"')", backgroundSize: "cover"}} className="min-h-screen">
            <h3 className="pt-8 text-center text-white text-3xl">{title}</h3>
            <div className="flex items-center justify-center max-w-screen min-h-screen">
                <div className="mt-4 flex flex-wrap max-w-screen justify-center content-center">
            {children}
                </div>
            </div>
        </div>
        <div className="text-center mt-4">
            {t("FOOTER_version")} 1.0 - {t("FOOTER_screenshots_by")} TheMulhoose - {t("FOOTER_thanks")} ❤️ - {t("FOOTER_not_official")} - <a href="https://github.com/simrail/EDR">Github project</a>
        </div>
    </div>;
}