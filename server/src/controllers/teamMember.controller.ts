import { Request, Response } from "express";
import * as teamMemberService from "../services/teamMember.service";

export async function index(_req: Request, res: Response) {
  try {
    const teamMembers = await teamMemberService.getPublicTeamMembers();
    return res.json({ success: true, data: teamMembers });
  } catch (error) {
    console.error("Get team members error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}

export async function experts(_req: Request, res: Response) {
  try {
    const data = await teamMemberService.getPublicExperts();
    return res.json({ success: true, data });
  } catch (error) {
    console.error("Get experts error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
}