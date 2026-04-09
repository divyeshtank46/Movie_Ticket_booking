import { useEffect, useState } from 'react'
import { getRevenue } from '../../services/Bookingservice';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Legend
} from "recharts";
import Loader from '../Loader';
// import Loader from '../components/Loader';

const RevenueChart = () => {
    const [revenue, setRevenue] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRevenue = async () => {
            try {
                setLoading(true);
                const res = await getRevenue();
                setRevenue(res || []);
            } catch (err) {
                console.error(err);
                setError("Failed to load revenue data");
            } finally {
                setLoading(false);
            }
        }
        fetchRevenue();
    }, [])

    // Format revenue for better display
    const formatRevenue = (value) => {
        if (value >= 100000) {
            return `₹${(value / 100000).toFixed(1)}L`;
        }
        if (value >= 1000) {
            return `₹${(value / 1000).toFixed(1)}K`;
        }
        return `₹${value}`;
    };

    // Custom Tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl p-3 shadow-2xl">
                    <p className="text-gray-300 text-sm mb-1">{label}</p>
                    <p className="text-2xl font-bold bg-linear-to-r from-red-500 to-purple-500 bg-clip-text text-transparent">
                        ₹{payload[0].value?.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Total Revenue</p>
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
                <div className="flex justify-center items-center h-64">
                    <Loader />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
                <div className="text-center">
                    <span className="text-4xl mb-2 block">📊</span>
                    <p className="text-red-400">{error}</p>
                </div>
            </div>
        );
    }

    if (revenue.length === 0) {
        return (
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
                <div className="text-center">
                    <span className="text-6xl mb-4 block animate-pulse">📊</span>
                    <h3 className="text-xl font-semibold text-white mb-2">No Revenue Data</h3>
                    <p className="text-gray-400 text-sm">No booking data available yet</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 
            shadow-2xl hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-500
            overflow-hidden">
            
            {/* Header */}
            <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold bg-linear-to-r from-red-500 to-purple-500 
                            bg-clip-text text-transparent">
                            Revenue Overview
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">
                            Daily revenue from all bookings
                        </p>
                    </div>
                    
                    {/* Total Revenue Badge */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                        <p className="text-xs text-gray-400">Total Revenue</p>
                        <p className="text-xl font-bold text-white">
                            ₹{revenue.reduce((sum, item) => sum + (item.TotalRevenue || 0), 0).toLocaleString()}
                        </p>
                    </div>
                </div>
                
                {/* Decorative Line */}
                <div className="w-16 h-1 bg-linear-to-r from-red-500 to-blue-500 mt-4"></div>
            </div>
            
            {/* Chart */}
            <div className="p-6">
                <div className="w-full h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={revenue} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                            {/* Gradient Definition */}
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#ef4444"/>
                                    <stop offset="50%" stopColor="#a855f7"/>
                                    <stop offset="100%" stopColor="#3b82f6"/>
                                </linearGradient>
                            </defs>
                            
                            {/* Grid with glass effect */}
                            <CartesianGrid 
                                strokeDasharray="3 3" 
                                stroke="rgba(255,255,255,0.1)"
                                vertical={false}
                            />
                            
                            {/* X Axis */}
                            <XAxis 
                                dataKey="_id" 
                                stroke="rgba(255,255,255,0.5)"
                                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                                tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                            />
                            
                            {/* Y Axis */}
                            <YAxis 
                                stroke="rgba(255,255,255,0.5)"
                                tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                                tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                                tickFormatter={formatRevenue}
                            />
                            
                            {/* Tooltip */}
                            <Tooltip content={<CustomTooltip />} />
                            
                            {/* Legend */}
                            <Legend 
                                wrapperStyle={{ color: 'rgba(255,255,255,0.7)' }}
                                formatter={() => 'Daily Revenue'}
                            />
                            
                            {/* Line with gradient stroke */}
                            <Line
                                type="monotone"
                                dataKey="TotalRevenue"
                                stroke="url(#strokeGradient)"
                                strokeWidth={3}
                                dot={{ 
                                    fill: '#ef4444', 
                                    stroke: 'white', 
                                    strokeWidth: 2, 
                                    r: 5,
                                    activeDot: { r: 8, fill: '#a855f7' }
                                }}
                                activeDot={{ r: 8, fill: '#a855f7', stroke: 'white', strokeWidth: 2 }}
                                fillOpacity={1}
                                fill="url(#colorRevenue)"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                
                {/* Stats Summary */}
                {revenue.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 text-center">
                            <p className="text-xs text-gray-400">Highest Revenue</p>
                            <p className="text-lg font-bold text-white">
                                ₹{Math.max(...revenue.map(r => r.TotalRevenue || 0)).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">
                                {revenue.find(r => r.TotalRevenue === Math.max(...revenue.map(r => r.TotalRevenue || 0)))?._id}
                            </p>
                        </div>
                        
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 text-center">
                            <p className="text-xs text-gray-400">Average Revenue</p>
                            <p className="text-lg font-bold text-white">
                                ₹{(revenue.reduce((sum, r) => sum + (r.TotalRevenue || 0), 0) / revenue.length).toFixed(0)}
                            </p>
                        </div>
                        
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 text-center">
                            <p className="text-xs text-gray-400">Total Days</p>
                            <p className="text-lg font-bold text-white">
                                {revenue.length}
                            </p>
                        </div>
                        
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 text-center">
                            <p className="text-xs text-gray-400">Peak Day</p>
                            <p className="text-lg font-bold text-white truncate">
                                {revenue.reduce((max, r) => (r.TotalRevenue > (max?.TotalRevenue || 0) ? r : max), null)?._id || '-'}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default RevenueChart;