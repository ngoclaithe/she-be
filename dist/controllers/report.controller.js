"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoryStatistics = exports.getYearlyReport = exports.getMonthlyReport = void 0;
const reportService = __importStar(require("../services/report.service"));
const getMonthlyReport = async (req, res) => {
    try {
        const { year, month } = req.query;
        const report = await reportService.getMonthlyReport(req.user.id, Number(year), Number(month));
        res.status(200).json(report);
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving monthly report', error });
    }
};
exports.getMonthlyReport = getMonthlyReport;
const getYearlyReport = async (req, res) => {
    try {
        const { year } = req.query;
        const report = await reportService.getYearlyReport(req.user.id, Number(year));
        res.status(200).json(report);
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving yearly report', error });
    }
};
exports.getYearlyReport = getYearlyReport;
const getCategoryStatistics = async (req, res) => {
    try {
        const stats = await reportService.getCategoryStatistics(req.user.id);
        res.status(200).json(stats);
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving category statistics', error });
    }
};
exports.getCategoryStatistics = getCategoryStatistics;
