import { Controller, Post, Get, Body } from "@nestjs/common";
import { BlocklistService } from "./blocklist.service";

@Controller("blocklist")
export class BlocklistController {
  constructor(private readonly blocklistService: BlocklistService) {}
}
