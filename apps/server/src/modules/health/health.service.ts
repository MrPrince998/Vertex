import { Injectable } from "@nestjs/common";

@Injectable()
export class HealthService {
  findAll() {
    return {
      status: "ok",
      service: "vextro-api",
      storage: "memory",
      queue: "in-process",
      ai: "disabled",
      checkedAt: new Date().toISOString(),
    };
  }
}
