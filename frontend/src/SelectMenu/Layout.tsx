import _isEmpty from "lodash/isEmpty";
import React from "react";
import {Navbar} from "flowbite-react/lib/esm/components/Navbar";
import {Dropdown} from "flowbite-react/lib/esm/components/Dropdown";
import AppLogo from "../images/logo.png";
import AppLogoWebp from "../images/logo.webp";
import Background from "../images/background.jpg";
import BackgroundWebp from "../images/background.webp";
import {useTranslation} from "react-i18next";
import {FR, GB, CZ, HU, DE, SK, IT, CN, PL, RU, RO, ES, NO} from "country-flag-icons/react/1x1";

import SGCS from "../images/communities/sgcs.webp";
import SRDACH from "../images/communities/dach.webp";
import SRFR from "../images/communities/srfr.webp";
import SRIT from "../images/communities/srit.webp";
import SRCN from "../images/communities/srcn.webp";
import OFPMafia from "../images/communities/ofpmafia.webp";
import {Button, DarkThemeToggle} from "flowbite-react";
import SubNavigation, { SubNavigationProps } from "../EDR/components/SubNavigation";
import { Link } from "react-router-dom";

const DropdownFlagIcon: React.FC<any> = ({children}) =>
    <span className="h-4 w-4 mr-4">
        {children}
    </span>

type Props = {
    children?: any,
    title: string,
    isWebpSupported: boolean,
    serverCode?: string,
}

export const SelectMenuLayout: React.FC<Props & SubNavigationProps> = ({children, title, isWebpSupported, navPreviousItem, navCurrentItem, navNextItem, serverCode}) => {
    const {t, i18n} = useTranslation();
    const background = isWebpSupported ? BackgroundWebp : Background;
    const appLogo = isWebpSupported ? AppLogoWebp : AppLogo;
    const isOnTrainsWindow = window.location.pathname.includes('trains');

    return <div className="text-primary">
        <Navbar fluid={true} className="sticky top-0 bg-slate-300 h-20 z-20">
            <Navbar.Brand href="/">
                <img src={appLogo} height={64} width={64} alt="App Logo"/>
                <span className="ml-4">EDR</span>
            </Navbar.Brand>
            <Navbar.Collapse>
                <div className="flex items-center space-x-4">
                    <Dropdown label={<>{t("NAVBAR_language")} ({i18n.language.toUpperCase()})</>} inline>
                        <Dropdown.Item icon={() => <DropdownFlagIcon><CZ /></DropdownFlagIcon>} onClick={() => i18n.changeLanguage("cz")}>
                            Česky
                        </Dropdown.Item>
                        <Dropdown.Item icon={() => <DropdownFlagIcon><DE /></DropdownFlagIcon>} onClick={() => i18n.changeLanguage("de")}>
                            Deutsch
                        </Dropdown.Item>
                        <Dropdown.Item icon={() => <DropdownFlagIcon><GB /></DropdownFlagIcon>} onClick={() => i18n.changeLanguage("en")}>
                            English
                        </Dropdown.Item>
                        <Dropdown.Item icon={() => <DropdownFlagIcon><ES /></DropdownFlagIcon>} onClick={() => i18n.changeLanguage("es")}>
                            Español
                        </Dropdown.Item>
                        <Dropdown.Item icon={() => <DropdownFlagIcon><FR /></DropdownFlagIcon>} onClick={() => i18n.changeLanguage("fr")}>
                            Français
                        </Dropdown.Item>
                        <Dropdown.Item icon={() => <DropdownFlagIcon><IT /></DropdownFlagIcon>} onClick={() => i18n.changeLanguage("it")}>
                            Italiano
                        </Dropdown.Item>
                        <Dropdown.Item icon={() => <DropdownFlagIcon><HU /></DropdownFlagIcon>} onClick={() => i18n.changeLanguage("hu")}>
                            Magyar
                        </Dropdown.Item>
                        <Dropdown.Item icon={() => <DropdownFlagIcon><NO /></DropdownFlagIcon>} onClick={() => i18n.changeLanguage("no")}>
                            Norsk
                        </Dropdown.Item>
                        <Dropdown.Item icon={() => <DropdownFlagIcon><PL /></DropdownFlagIcon>} onClick={() => i18n.changeLanguage("pl")}>
                            Polski
                        </Dropdown.Item>
                        <Dropdown.Item icon={() => <DropdownFlagIcon><RO /></DropdownFlagIcon>} onClick={() => i18n.changeLanguage("ro")}>
                            Română
                        </Dropdown.Item>
                        <Dropdown.Item icon={() => <DropdownFlagIcon><SK /></DropdownFlagIcon>} onClick={() => i18n.changeLanguage("sk")}>
                            Slovenčina
                        </Dropdown.Item>
                        <Dropdown.Item icon={() => <DropdownFlagIcon><RU /></DropdownFlagIcon>} onClick={() => i18n.changeLanguage("ru")}>
                            Русский
                        </Dropdown.Item>
                        <Dropdown.Item icon={() => <DropdownFlagIcon><CN /></DropdownFlagIcon>} onClick={() => i18n.changeLanguage("cn")}>
                            中文
                        </Dropdown.Item>
                    </Dropdown>

                    <Navbar.Link href="https://github.com/simrail/EDR" target="_blank">
                        Github
                    </Navbar.Link>
                    <Navbar.Link href="https://github.com/simrail/EDR/issues" target="_blank">
                        {t("NAVBAR_bugs")}
                    </Navbar.Link>
                </div>
                <Navbar.Link>
                    <DarkThemeToggle />
                </Navbar.Link>

            </Navbar.Collapse>
        </Navbar>

        {_isEmpty(navPreviousItem) || _isEmpty(navCurrentItem) || _isEmpty(navNextItem) || (
            <SubNavigation 
                navPreviousItem={navPreviousItem}
                navCurrentItem={navCurrentItem}
                navNextItem={navNextItem}
            />
        )}
        <div style={{backgroundImage: "url('"+background+"')", backgroundSize: "auto"}} className="bg-fixed min-h-screen">
            <div className="pl-4 pt-4 flex justify-center mr-0 flex-wrap lg:justify-end lg:mr-16 lg:flex-nowrap">
                <Button size="xs" color="light" className="mx-2 my-2 lg:my-0" href="https://forum.simrail.eu/">
                    <span className="inline-flex items-center "><img src={SGCS} height={16} width={16} alt="Community logo"/>&nbsp;Simrail Official</span>
                </Button>
                <Button size="xs" color="light" className="mx-2 my-2 lg:my-0" href="https://discord.com/invite/XgJpXpG2Eu">
                    <span className="inline-flex items-center "><img src={SGCS} height={16} width={16} alt="Community logo"/>&nbsp;Simrail Global</span>
                </Button>
                <Button size="xs" color="light" className="mx-2 my-2 lg:my-0" href="https://discord.gg/simrailfrœ">
                    <span className="inline-flex items-center "><img src={SRFR} height={16} width={16} alt="Community logo"/>&nbsp;Simrail FR/CH/BE</span>
                </Button>
                <Button size="xs" color="light" className="mx-2 my-2 lg:my-0" href="https://discord.gg/DztnvgePXw">
                    <span className="inline-flex items-center "><img src={OFPMafia} height={16} width={16} alt="Community logo"/>&nbsp;OFPMafia CZ/SK</span>
                </Button>
                <Button size="xs" color="light" className="mx-2 my-2 lg:my-0" href="https://discord.gg/YWrRGYqNC8">
                    <span className="inline-flex items-center "><img src={SRDACH} height={16} width={16} alt="Community logo"/>&nbsp;Simrail DACH</span>
                </Button>
                <Button size="xs" color="light" className="mx-2 my-2 lg:my-0" href="https://discord.gg/5cdpDv2nT8">
                    <span className="inline-flex items-center "><img src={SRIT} height={16} width={16} alt="Community logo"/>&nbsp;Simrail ITA</span>
                </Button>
                <Button size="xs" color="light" className="mx-2 my-2 lg:my-0" href="https://discord.gg/3NdnVDme5k">
                    <span className="inline-flex items-center "><img src={SRCN} height={16} width={16} alt="Community logo"/>&nbsp;SimRail CN</span>
                </Button>
                <Button size="xs" color="light" className="mx-2 my-2 lg:my-0" href="https://discord.gg/Kyte5PB6xf">
                    <span className="inline-flex items-center "><img src={SGCS} height={16} width={16} alt="Community logo"/>&nbsp;Simrail Russian Speaking</span>
                </Button>
                <Button size="xs" color="light" className="mx-2 my-2 lg:my-0" href="https://discord.gg/SBjfNW8F3U">
                    <span className="inline-flex items-center "><PL height={16} width={16}/>&nbsp;Simrail Polska</span>
                </Button>
            </div>
            <h3 className="pt-8 text-center text-white text-3xl">{title}</h3>

            {serverCode ? (
                <div className="flex items-start justify-center max-w-screen min-h-screen">
                    <div className="p-8 flex flex-wrap max-w-screen justify-center content-start w-full">
                        <ul className="w-full text-sm font-medium text-center text-gray-500 divide-x divide-gray-200 rounded-lg shadow sm:flex dark:divide-gray-700 dark:text-gray-400 mb-8">
                            <li className="w-full">
                                <Link to={`/${serverCode}/`} className={`${!isOnTrainsWindow ? 'active text-gray-900 bg-gray-100 dark:bg-gray-700 dark:text-white' : 'bg-white hover:text-gray-700 hover:bg-gray-50 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700'} inline-block w-full p-4 rounded-lg sm:rounded-none sm:rounded-l-lg focus:ring-4 focus:ring-blue-300 focus:outline-none`} aria-current="page">Stations</Link>
                            </li>
                            <li className="w-full">
                                <Link to={`/${serverCode}/trains`} className={`${isOnTrainsWindow ? 'active text-gray-900 bg-gray-100 dark:bg-gray-700 dark:text-white' : 'bg-white hover:text-gray-700 hover:bg-gray-50 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700'} inline-block w-full p-4 rounded-lg sm:rounded-none sm:rounded-r-lg focus:ring-4 focus:outline-none focus:ring-blue-300`}>Trains</Link>
                            </li>
                        </ul>
                        {children}
                    </div>
                </div>
            ) : (
                children
            )}
        </div>
        <div className="text-center p-4">
            {t("FOOTER_version")} 2.3 - {t("FOOTER_screenshots_by")} MilanSVK - {t("FOOTER_thanks")} ❤️ - {t("FOOTER_not_official")}
        </div>
    </div>;
}