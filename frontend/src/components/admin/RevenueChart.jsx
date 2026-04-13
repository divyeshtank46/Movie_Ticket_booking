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
                <div className="bg-gray-900 border border-gray-700 rounded-xl p-3 shadow-2xl">
                    <p className="text-gray-300 text-sm mb-1">{label}</p>
                    <p className="text-2xl font-bold text-red-500">
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
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
                <div className="flex justify-center items-center h-64">
                    <Loader />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
                <div className="text-center">
                    <span className="text-4xl mb-2 block">📊</span>
                    <p className="text-red-400">{error}</p>
                </div>
            </div>
        );
    }

    if (revenue.length === 0) {
        return (
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-8">
                <div className="text-center">
                    <span className="text-6xl mb-4 block">📊</span>
                    <h3 className="text-xl font-semibold text-white mb-2">No Revenue Data</h3>
                    <p className="text-gray-400 text-sm">No booking data available yet</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-900 rounded-2xl border border-gray-800 
            shadow-2xl hover:shadow-2xl hover:shadow-red-900/20 transition-all duration-500
            overflow-hidden">
            
            {/* Header */}
            <div className="p-6 border-b border-gray-800">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-red-500">
                            Revenue Overview
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">
                            Daily revenue from all bookings
                        </p>
                    </div>
                    
                    {/* Total Revenue Badge */}
                    <div className="bg-gray-800 rounded-xl px-4 py-2 border border-gray-700">
                        <p className="text-xs text-gray-400">Total Revenue</p>
                        <p className="text-xl font-bold text-white">
                            ₹{revenue.reduce((sum, item) => sum + (item.TotalRevenue || 0), 0).toLocaleString()}
                        </p>
                    </div>
                </div>
                
                {/* Decorative Line */}
                <div className="w-16 h-0.5 bg-red-600 mt-4"></div>
            </div>
            
            {/* Chart */}
            <div className="p-6">
                <div className="w-full h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={revenue} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                            {/* Grid */}
                            <CartesianGrid 
                                strokeDasharray="3 3" 
                                stroke="rgba(255,255,255,0.05)"
                                vertical={false}
                            />
                            
                            {/* X Axis */}
                            <XAxis 
                                dataKey="_id" 
                                stroke="rgba(255,255,255,0.3)"
                                tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                                tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                            />
                            
                            {/* Y Axis */}
                            <YAxis 
                                stroke="rgba(255,255,255,0.3)"
                                tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
                                tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                                tickFormatter={formatRevenue}
                            />
                            
                            {/* Tooltip */}
                            <Tooltip content={<CustomTooltip />} />
                            
                            {/* Legend */}
                            <Legend 
                                wrapperStyle={{ color: 'rgba(255,255,255,0.6)' }}
                                formatter={() => 'Daily Revenue'}
                            />
                            
                            {/* Line */}
                            <Line
                                type="monotone"
                                dataKey="TotalRevenue"
                                stroke="#ef4444"
                                strokeWidth={3}
                                dot={{ 
                                    fill: '#ef4444', 
                                    stroke: '#1f2937', 
                                    strokeWidth: 2, 
                                    r: 5
                                }}
                                activeDot={{ r: 8, fill: '#dc2626', stroke: '#1f2937', strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                
                {/* Stats Summary */}
                {revenue.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-800">
                        <div className="bg-gray-800 rounded-xl p-3 text-center">
                            <p className="text-xs text-gray-400">Highest Revenue</p>
                            <p className="text-lg font-bold text-white">
                                ₹{Math.max(...revenue.map(r => r.TotalRevenue || 0)).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">
                                {revenue.find(r => r.TotalRevenue === Math.max(...revenue.map(r => r.TotalRevenue || 0)))?._id}
                            </p>
                        </div>
                        
                        <div className="bg-gray-800 rounded-xl p-3 text-center">
                            <p className="text-xs text-gray-400">Average Revenue</p>
                            <p className="text-lg font-bold text-white">
                                ₹{(revenue.reduce((sum, r) => sum + (r.TotalRevenue || 0), 0) / revenue.length).toFixed(0)}
                            </p>
                        </div>
                        
                        <div className="bg-gray-800 rounded-xl p-3 text-center">
                            <p className="text-xs text-gray-400">Total Days</p>
                            <p className="text-lg font-bold text-white">
                                {revenue.length}
                            </p>
                        </div>
                        
                        <div className="bg-gray-800 rounded-xl p-3 text-center">
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