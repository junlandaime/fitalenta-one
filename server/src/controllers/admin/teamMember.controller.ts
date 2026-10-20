import { Request, Response } from "express";
import { matchedData } from "express-validator";
import type { TeamMemberType } from "../../../generated/prisma/client";
import * as teamMemberService from "../../services/admin/teamMember.service";
import {
  CreateMemberInput,
  MemberListFilters,
  UpdateMemberInput,
} from "../../types/team-member.types";

type Handler = (req: Request, res: Response) => Promise<Response>;

export interface MemberHandlers {
  list: Handler;
  show: Handler;
  store: Handler;
  update: Handler;
  destroy: Handler;
  reorder: Handler;
}

function createMemberHandlers(type: TeamMemberType, label: string): MemberHandlers {
  return {
    async list(req, res) {
      const { items, meta, summary } = await teamMemberService.listMembers(type, matchedData<MemberListFilters>(req));
      return res.json({ success: true, data: items, meta, summary });
    },

    async show(req, res) {
      const { id } = matchedData<{ id: number }>(req);
      const data = await teamMemberService.getMemberById(type, id);
      return res.json({ success: true, data });
    },

    async store(req, res) {
      const data = await teamMemberService.createMember(type, matchedData<CreateMemberInput>(req), req.file);
      return res.status(201).json({ success: true, message: `${label} berhasil dibuat`, data });
    },

    async update(req, res) {
      const { id, ...input } = matchedData<UpdateMemberInput & { id: number }>(req);
      const data = await teamMemberService.updateMember(type, id, input, req.file);
      return res.json({ success: true, message: `${label} berhasil diperbarui`, data });
    },

    async destroy(req, res) {
      const { id } = matchedData<{ id: number }>(req);
      await teamMemberService.deleteMember(type, id);
      return res.json({ success: true, message: `${label} berhasil dihapus` });
    },

    async reorder(req, res) {
      const { ids } = matchedData<{ ids: number[] }>(req);
      const data = await teamMemberService.reorderMembers(type, ids);
      return res.json({ success: true, message: `Urutan ${label.toLowerCase()} berhasil diperbarui`, data });
    },
  };
}

export const experts = createMemberHandlers("expert", "Expert");
export const members = createMemberHandlers("team", "Team Member");