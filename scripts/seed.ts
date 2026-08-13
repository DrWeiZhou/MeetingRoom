import bcrypt from "bcryptjs";
import postgres from "postgres";

const teachers = [
  ["wanglei", "王雷"], ["changjian", "常健"], ["songchuanwang", "宋传旺"],
  ["fengqiuxia", "冯秋霞"], ["guoshuai", "郭帅"], ["liuxiuyan", "刘秀艳"],
  ["xieyaocong", "谢曜聪"], ["zhoulijian", "周立俭"], ["zhuyuqin", "朱玉芹"],
  ["zhouwei", "周炜"], ["jiangyu", "姜宇"], ["yangchuang", "杨闯"],
  ["suyining", "苏怡宁"], ["zhangsu", "张苏"], ["lizhuang", "李壮"],
  ["tianmiaoqing", "田淼清"], ["huyifan", "胡一帆"], ["sunjie", "孙洁"],
  ["lvqingxuan", "吕清轩"], ["zourui", "邹锐"], ["maguanguo", "马官国"],
  ["daiming", "戴铭"], ["huangchenxuan", "黄晨烜"],
  ["zhouquanqiang", "周全强"], ["wangmengmeng", "王蒙蒙"],
  ["wangxupeng", "王续澎"], ["sunzhongwei", "孙中卫"],
] as const;

const rooms = [
  ["第一会议室", "1007"],
  ["第二会议室", "1010"],
  ["小会议室", "1007"],
] as const;

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
  const sql = postgres(process.env.DATABASE_URL, { prepare: false, max: 1 });
  const passwordHash = await bcrypt.hash("123456", 12);

  await sql.begin(async (tx) => {
    await tx`
      insert into users (username, display_name, password_hash, role, must_change_password)
      values ('liujia', '刘佳', ${passwordHash}, 'admin', true)
      on conflict (username) do update set display_name = excluded.display_name, role = 'admin'
    `;
    for (const [username, displayName] of teachers) {
      await tx`
        insert into users (username, display_name, password_hash, role, must_change_password)
        values (${username}, ${displayName}, ${passwordHash}, 'teacher', true)
        on conflict (username) do update set display_name = excluded.display_name
      `;
    }
    for (const [name, roomNumber] of rooms) {
      const existing = await tx`select id from rooms where name = ${name} limit 1`;
      if (existing.length === 0) await tx`insert into rooms (name, room_number) values (${name}, ${roomNumber})`;
    }
  });

  await sql.end();
  console.log(`Seeded 1 admin, ${teachers.length} unique teachers and ${rooms.length} rooms.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
