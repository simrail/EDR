import React, {Fragment} from 'react';
import {EDR} from "./EDR";
import "./index.css"
import {Flowbite} from "flowbite-react";
import {ServerSelect} from "./SelectMenu/ServerSelect";
import {PostSelect} from "./SelectMenu/PostSelect";
import {useSoundNotification} from "./EDR/hooks/useSoundNotification";
import {BrowserRouter, Route, Routes} from "react-router-dom";

function App() {
    const [SoundNotification, playSoundNotification] = useSoundNotification();

    return <Flowbite>
        <SoundNotification />
        <div className="min-h-screen dark:bg-slate-800 text-black dark:text-white">
            <BrowserRouter>
                <Fragment>
                    <Routes>
                        <Route path="/" element={<ServerSelect />} />
                        <Route path="/:serverCode" element={<PostSelect />} />
                        <Route path="/:serverCode/station/:post" element={<EDR playSoundNotification={playSoundNotification} />} />
                    </Routes>
                </Fragment>
            </BrowserRouter>
        </div>
    </Flowbite>
}

export default App;
