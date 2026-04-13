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
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
            <div className="relative bg-gray-900 rounded-3xl p-12 border border-gray-800 shadow-2xl">
                {/* Decorative top bar */}
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 
                    w-32 h-1 bg-red-600 rounded-full"></div>

                {/* Clock */}
                <div className="relative w-48 h-48 mx-auto mb-8">
                    {/* Clock face */}
                    <div className="absolute inset-0 bg-gray-800 rounded-full border-2 border-gray-700"></div>
                    
                    <div className="absolute inset-2 bg-red-900/20 rounded-full"></div>

                    {/* Clock markers */}
                    {[...Array(12)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-3 bg-gray-600 rounded-full"
                            style={{
                                top: "50%",
                                left: "50%",
                                transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-80px)`
                            }}
                        />
                    ))}

                    {/* Hour markers (3,6,9,12) */}
                    {[0, 3, 6, 9].map((marker, i) => (
                        <div
                            key={i}
                            className="absolute w-1.5 h-4 bg-red-600 rounded-full"
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
                        bg-red-600 rounded-full origin-bottom"
                        style={{
                            transform: `translate(-50%, -100%) rotate(${hourDeg}deg)`
                        }}
                    />

                    {/* Minute Hand */}
                    <div
                        className="absolute top-1/2 left-1/2 w-0.5 h-20 
                        bg-blue-600 rounded-full origin-bottom"
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
                        w-4 h-4 bg-red-600 rounded-full border-2 border-gray-700"></div>
                </div>

                {/* Loading text */}
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-red-500 mb-2">
                        LOADING
                    </h2>

                    <div className="flex justify-center gap-2">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="w-2 h-2 bg-red-600 rounded-full animate-bounce"
                                style={{ animationDelay: `${i * 0.2}s` }}
                            />
                        ))}
                    </div>
                </div>

                {/* Progress bar */}
                <div className="relative w-64 h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                    <div
                        className="absolute top-0 left-0 h-full bg-red-600 rounded-full
                        transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Decorative elements */}
                <div className="absolute -bottom-4 -left-4 w-16 h-16 
                    bg-red-900/20 rounded-full"></div>

                <div className="absolute -top-4 -right-4 w-20 h-20 
                    bg-blue-900/20 rounded-full"></div>

                <div className="absolute top-2 left-2 text-2xl opacity-10">🎬</div>
                <div className="absolute bottom-2 right-2 text-2xl opacity-10 rotate-180">🎬</div>
            </div>
        </div>
    );
};

export default Loader;