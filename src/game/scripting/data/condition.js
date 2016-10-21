import * as lc from '../process/condition';

export const ConditionOpcode = [
    { opcode: 0x00, command: "COL", callback: lc.COL, param: 0, value_size: 1 },
    { opcode: 0x01, command: "COL_OBJ", callback: lc.COL_OBJ, param: 1, value_size: 1 },
    { opcode: 0x02, command: "DISTANCE", callback: lc.DISTANCE, param: 1, value_size: 2 },
    { opcode: 0x03, command: "ZONE", callback: lc.ZONE, param: 0, value_size: 1 },
    { opcode: 0x04, command: "ZONE_OBJ", callback: lc.ZONE_OBJ, param: 1, value_size: 1 },
    { opcode: 0x05, command: "BODY", callback: lc.BODY, param: 0, value_size: 1 },
    { opcode: 0x06, command: "BODY_OBJ", callback: lc.BODY_OBJ, param: 1, value_size: 1 },
    { opcode: 0x07, command: "ANIM", callback: lc.ANIM, param: 0, value_size: 2 },
    { opcode: 0x08, command: "ANIM_OBJ", callback: lc.ANIM_OBJ, param: 1, value_size: 2 },
    { opcode: 0x09, command: "CURRENT_TRACK", callback: lc.CURRENT_TRACK, param: 0, value_size: 1 },
    { opcode: 0x0A, command: "CURRENT_TRACK_OBJ", callback: lc.CURRENT_TRACK_OBJ, param: 1, value_size: 1 },
    { opcode: 0x0B, command: "VAR_CUBE", callback: lc.VAR_CUBE, param: 1, value_size: 1 },
    { opcode: 0x0C, command: "CONE_VIEW", callback: lc.CONE_VIEW, param: 1, value_size: 2 },
    { opcode: 0x0D, command: "HIT_BY", callback: lc.HIT_BY, param: 0, value_size: 1 },
    { opcode: 0x0E, command: "ACTION", callback: lc.ACTION, param: 0, value_size: 1 },
    { opcode: 0x0F, command: "VAR_GAME", callback: lc.VAR_GAME, param: 1, value_size: 2 },
    { opcode: 0x10, command: "LIFE_POINT", callback: lc.LIFE_POINT, param: 0, value_size: 2 },
    { opcode: 0x11, command: "LIFE_POINT_OBJ", callback: lc.LIFE_POINT_OBJ, param: 1, value_size: 2 },
    { opcode: 0x12, command: "NUM_LITTLE_KEYS", callback: lc.NUM_LITTLE_KEYS, param: 0, value_size: 1 },
    { opcode: 0x13, command: "NUM_GOLD_PIECES", callback: lc.NUM_GOLD_PIECES, param: 0, value_size: 2 },
    { opcode: 0x14, command: "BEHAVIOUR", callback: lc.BEHAVIOUR, param: 0, value_size: 1 },
    { opcode: 0x15, command: "CHAPTER", callback: lc.CHAPTER, param: 0, value_size: 1 },
    { opcode: 0x16, command: "DISTANCE_3D", callback: lc.DISTANCE_3D, param: 1, value_size: 1 },
    { opcode: 0x17, command: "MAGIC_LEVEL", callback: lc.MAGIC_LEVEL, param: 0, value_size: 1 },
    { opcode: 0x18, command: "MAGIC_POINT", callback: lc.MAGIC_POINT, param: 0, value_size: 1 },
    { opcode: 0x19, command: "USE_INVENTORY", callback: lc.USE_INVENTORY, param: 1, value_size: 1 },
    { opcode: 0x1A, command: "CHOICE", callback: lc.CHOICE, param: 0, value_size: 2 },
    { opcode: 0x1B, command: "FUEL", callback: lc.FUEL, param: 0, value_size: 1 },
    { opcode: 0x1C, command: "CARRIED_BY", callback: lc.CARRIED_BY, param: 0, value_size: 1 },
    { opcode: 0x1D, command: "CDROM", callback: lc.CDROM, param: 0, value_size: 1 },
    { opcode: 0x1E, command: "LADDER", callback: lc.LADDER, param: 0, value_size: 1 },
    { opcode: 0x1F, command: "RND", callback: lc.RND, param: 1, value_size: 1 },
    { opcode: 0x20, command: "RAIL", callback: lc.RAIL, param: 1, value_size: 1 },
    { opcode: 0x21, command: "BETA", callback: lc.BETA, param: 0, value_size: 2 },
    { opcode: 0x22, command: "BETA_OBJ", callback: lc.BETA_OBJ, param: 1, value_size: 2 },
    { opcode: 0x23, command: "CARRIED_OBJ_BY", callback: lc.CARRIED_OBJ_BY, param: 1, value_size: 1 },
    { opcode: 0x24, command: "ANGLE", callback: lc.ANGLE, param: 1, value_size: 2 },
    { opcode: 0x25, command: "DISTANCE_MESSAGE", callback: lc.DISTANCE_MESSAGE, param: 1, value_size: 2 },
    { opcode: 0x26, command: "HIT_OBJ_BY", callback: lc.HIT_OBJ_BY, param: 1, value_size: 1 },
    { opcode: 0x27, command: "REAL_ANGLE", callback: lc.REAL_ANGLE, param: 0, value_size: 2 },
    { opcode: 0x28, command: "DEMO", callback: lc.DEMO, param: 0, value_size: 1 },
    { opcode: 0x29, command: "COL_DECORS", callback: lc.COL_DECORS, param: 0, value_size: 1 },
    { opcode: 0x2A, command: "COL_DECORS_OBJ", callback: lc.COL_DECORS_OBJ, param: 1, value_size: 1 },
    { opcode: 0x2B, command: "PROCESSOR", callback: lc.PROCESSOR, param: 0, value_size: 1 },
    { opcode: 0x2C, command: "OBJECT_DISPLAYED", callback: lc.OBJECT_DISPLAYED, param: 0, value_size: 1 },
    { opcode: 0x2D, command: "ANGLE_OBJ", callback: lc.ANGLE_OBJ, param: 0, value_size: 1 }
];
