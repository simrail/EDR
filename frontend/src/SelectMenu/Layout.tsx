import React from "react";
import {Navbar} from "flowbite-react/lib/esm/components/Navbar";
import {Dropdown} from "flowbite-react/lib/esm/components/Dropdown";
import AppLogo from "../images/logo.png";
import AppLogoWebp from "../images/logo.webp";
import Background from "../images/background.jpg";
import BackgroundWebp from "../images/background.webp";
import {useTranslation} from "react-i18next";
import {FR, GB, CZ, HU, DE, SK, IT} from "country-flag-icons/react/1x1";

import SGCS from "../images/communities/sgcs.webp";
import SRDE from "../images/communities/srde.webp";
import SRFR from "../images/communities/srfr.png";
import OFPMafia from "../images/communities/ofpmafia.webp";
import {Button} from "flowbite-react";

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

                <Navbar.Link href="https://github.com/simrail/EDR" target="_blank">
                    Github
                </Navbar.Link>
                <Navbar.Link href="https://github.com/DKFN/edr-issues/issues" target="_blank">
                    {t("NAVBAR_bugs")}
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>

        <div style={{backgroundImage: "url('"+background+"')", backgroundSize: "cover"}} className="min-h-screen">
            <div className="pl-4 pt-4 flex justify-end mr-16">
                <Button size="xs" color="gray" className="mx-2" href="https://discord.com/invite/XgJpXpG2Eu">
                    <span className="inline-flex items-center "><img src={SGCS} height={16} width={16} alt="Community logo"/>&nbsp;Simrail Global</span>
                </Button>
                <Button size="xs" color="gray" className="mx-2" href="https://simrail.fr/discord">
                    <span className="inline-flex items-center "><img src={SRFR} height={16} width={16} alt="Community logo"/>&nbsp;Simrail France</span>
                </Button>
                <Button size="xs" color="gray" className="mx-2" href="https://discord.gg/DztnvgePXw">
                    <span className="inline-flex items-center "><img src={OFPMafia} height={16} width={16} alt="Community logo"/>&nbsp;OFPMafia</span>
                </Button>
                <Button size="xs" color="gray" className="mx-2" href="https://discord.gg/A63hJphHQ4">
                    <span className="inline-flex items-center "><img src={SRDE} height={16} width={16} alt="Community logo"/>&nbsp;Simrail Germany</span>
                </Button>
            </div>
            <h3 className="pt-8 text-center text-white text-3xl">{title}</h3>
            <div className="flex items-start justify-center max-w-screen min-h-screen">
                <div className="mt-4 p-8 flex flex-wrap max-w-screen justify-center content-start">
                    {children}
                </div>
            </div>
        </div>
        <div className="text-center mt-4">
            {t("FOOTER_version")} 1.0 - {t("FOOTER_screenshots_by")} TheMulhoose - {t("FOOTER_thanks")} ❤️ - {t("FOOTER_not_official")} - <a href="https://github.com/simrail/EDR">Github project</a>
        </div>
    </div>;
}