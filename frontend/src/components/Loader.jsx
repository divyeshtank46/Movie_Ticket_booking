import React, { useEffect, useState } from "react";
import "../styles/index.css";

const Loader = () => {
    const [time, setTime] = useState(new Date());
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        const progressInterval = setInterval(() => {
            setProgress(prev => (prev >= 100 ? 0 : prev + 1));
        }, 30);

        return () => {
            clearInterval(interval);
            clearInterval(progressInterval);
        };
    }, []);

    const minutes = time.getMinutes();
    const hours = time.getHours();
    const seconds = time.getSeconds();

    const minuteDeg = minutes * 6 + seconds * 0.1;
    const hourDeg = (hours % 12) * 30 + minutes * 0.5;
    const secondDeg = seconds * 6;

    return (
        <div className="fixed inset-0 bg-[#0a0a0f] flex items-center justify-center z-50">

            <div className="absolute inset-0 bg-linear-to-r from-red-600/10 via-purple-600/10 to-blue-600/10 animate-gradient-x"></div>

            <div className="relative bg-white/5 backdrop-blur-2xl rounded-3xl p-12 
                border border-white/10 shadow-2xl">

                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 
                    w-32 h-1 bg-linear-to-r from-red-500 via-purple-500 to-blue-500 
                    rounded-full"></div>

                {/* Clock */}
                <div className="relative w-48 h-48 mx-auto mb-8">

                    <div className="absolute inset-0 bg-linear-to-br from-white/10 to-white/5 
                        backdrop-blur-sm rounded-full border-2 border-white/20 
                        shadow-2xl"></div>

                    <div className="absolute inset-2 bg-linear-to-br from-red-500/20 
                        to-purple-500/20 rounded-full blur-md"></div>

                    {/* Clock markers */}
                    {[...Array(12)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-3 bg-white/30 rounded-full"
                            style={{
                                top: "50%",
                                left: "50%",
                                transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-80px)`
                            }}
                        />
                    ))}

                    {/* Hour markers */}
                    {[0, 3, 6, 9].map((marker, i) => (
                        <div
                            key={i}
                            className="absolute w-1.5 h-4 bg-linear-to-b from-red-500 to-purple-500 
                                rounded-full shadow-lg shadow-red-500/50"
                            style={{
                                top: "50%",
                                left: "50%",
                                transform: `translate(-50%, -50%) rotate(${marker * 30}deg) translateY(-80px)`
                            }}
                        />
                    ))}

                    {/* Hour Hand */}
                    <div
                        className="absolute top-1/2 left-1/2 w-1 h-14 
                        bg-linear-to-t from-red-500 to-purple-500 rounded-full
                        shadow-lg shadow-red-500/50 origin-bottom"
                        style={{
                            transform: `translate(-50%, -100%) rotate(${hourDeg}deg)`
                        }}
                    />

                    {/* Minute Hand */}
                    <div
                        className="absolute top-1/2 left-1/2 w-0.5 h-20 
                        bg-linear-to-t from-blue-500 to-purple-500 rounded-full
                        shadow-lg shadow-blue-500/50 origin-bottom"
                        style={{
                            transform: `translate(-50%, -100%) rotate(${minuteDeg}deg)`
                        }}
                    />

                    {/* Second Hand */}
                    <div
                        className="absolute top-1/2 left-1/2 w-0.5 h-24 
                        bg-red-400 rounded-full origin-bottom"
                        style={{
                            transform: `translate(-50%, -100%) rotate(${secondDeg}deg)`
                        }}
                    />

                    {/* Center dot */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                        w-4 h-4 bg-linear-to-r from-red-500 to-purple-500 rounded-full 
                        border-2 border-white/30 shadow-lg animate-pulse"></div>
                </div>

                {/* Loading text */}
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold bg-linear-to-r 
                        from-red-500 via-purple-500 to-blue-500 bg-clip-text 
                        text-transparent animate-gradient mb-2">
                        LOADING
                    </h2>

                    <div className="flex justify-center gap-2">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="w-2 h-2 bg-linear-to-r from-red-500 to-purple-500 
                                    rounded-full animate-bounce"
                                style={{ animationDelay: `${i * 0.2}s` }}
                            />
                        ))}
                    </div>
                </div>

                {/* Progress bar */}
                <div className="relative w-64 h-2 bg-white/10 rounded-full overflow-hidden 
                    backdrop-blur-sm border border-white/20">
                    <div
                        className="absolute top-0 left-0 h-full bg-linear-to-r 
                        from-red-500 via-purple-500 to-blue-500 rounded-full
                        transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    >
                        <div className="absolute top-0 right-0 w-20 h-full 
                            bg-linear-to-r from-transparent via-white/30 to-transparent 
                            animate-shine"></div>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -bottom-4 -left-4 w-16 h-16 
                    bg-linear-to-r from-red-500/20 to-purple-500/20 
                    rounded-full blur-xl animate-pulse"></div>

                <div className="absolute -top-4 -right-4 w-20 h-20 
                    bg-linear-to-r from-blue-500/20 to-purple-500/20 
                    rounded-full blur-xl animate-pulse delay-1000"></div>

                <div className="absolute top-2 left-2 text-2xl opacity-20">🎬</div>
                <div className="absolute bottom-2 right-2 text-2xl opacity-20 rotate-180">🎬</div>
            </div>

        </div>
    );
};

export default Loader;