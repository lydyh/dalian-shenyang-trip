"use client";

import { useEffect, useMemo, useState } from "react";

type City = "大连" | "沈阳";
type Section = "plan" | "map" | "food" | "swap" | "bath" | "list";

type Stop = {
  time: string;
  kind: "早餐" | "午餐" | "晚餐" | "甜品" | "游玩" | "交通" | "住宿";
  place: string;
  city?: City;
  order?: string;
  detail: string;
  duration: string;
  tags?: string[];
  booking?: { level: "required" | "recommended" | "none"; label: string; note?: string };
};

type Day = {
  id: string;
  date: string;
  weekday: string;
  city: string;
  title: string;
  subtitle: string;
  tip: string;
  stops: Stop[];
};

type Place = {
  id: string;
  city: City;
  name: string;
  short: string;
  type: string;
  x: number;
  y: number;
  note: string;
  order: number;
};

const days: Day[] = [
  {
    id: "d1", date: "8/4", weekday: "周二", city: "大连", title: "落地星海，慢慢追日落", subtitle: "入住后只走西海岸，不跨区",
    tip: "日月昇午餐分量大，两人点 3 道足够；当天日落时间出发前再看一次。",
    stops: [
      { time: "12:00", kind: "住宿", place: "抵达大连 · 入住星海广场", detail: "放行李、补水休息。华住会优先看星海广场漫心、全季星海会展中心；旺季房价波动大，尽早锁可取消价。", duration: "1h", tags: ["华住会", "行李"] },
      { time: "13:15", kind: "午餐", place: "日月昇渔家菜（星海公园店）", order: "海肠捞饭＋鲅鱼水饺＋软炸肉", detail: "就在住宿片区解决第一顿，海肠捞饭在这里吃最顺路。连锁老店、菜量大，口味稳定度比“专程追小馆”更适合落地日。", duration: "1.5h", tags: ["必吃", "人均约 ¥90–130"] },
      { time: "15:10", kind: "游玩", place: "付家庄海滨浴场", detail: "海边慢走，作为旅程开场；天气闷热就把停留压缩到 40 分钟。", duration: "50m", tags: ["看海"] },
      { time: "16:20", kind: "游玩", place: "莲花山健身步道 → 免费观景凉亭", detail: "不买小火车套票，走健身步道约 15–25 分钟上山，再拐进侧面免费观景凉亭拍跨海大桥。若体力不足或天气闷热，直接跳过，把时间留给海边日落。", duration: "1.2h", tags: ["视频优化", "免费路线"], booking: { level: "none", label: "无需预约／门票", note: "小火车和观景台票属于可选消费，主线走免费步道。" } },
      { time: "18:00", kind: "游玩", place: "银沙滩 → 跨海大桥观景点", detail: "银沙滩拍照后前往大桥观景点，至少在日落前 40 分钟抵达。", duration: "2h", tags: ["日落重点"] },
      { time: "20:20", kind: "晚餐", place: "喜鼎海胆水饺（星海店）", order: "海胆水饺＋三鲜焖子；午餐吃撑则只点一份水饺", detail: "离住处近，晚归不用再横穿市区。它偏精致和游客友好，价格高于普通饺子馆，建议少点。", duration: "1h", tags: ["顺路", "人均约 ¥90–150"] },
    ],
  },
  {
    id: "d2", date: "8/5", weekday: "周三", city: "大连", title: "东海岸、老街与港口夜", subtitle: "从菱角湾一路向北收尾东港",
    tip: "老虎滩片区不要自驾，直接坐地铁 5 号线；滨海路这一段按燕窝岭 → 北大桥走，更省体力。",
    stops: [
      { time: "08:00", kind: "早餐", place: "酒店早餐", order: "粥／面＋鸡蛋，别吃太撑", detail: "今天海边步行多，早餐在酒店解决最省时间。", duration: "40m", tags: ["省时"] },
      { time: "09:00", kind: "游玩", place: "菱角湾 → 渔人码头", detail: "坐地铁 5 号线到老虎滩片区，不自驾。先拍菱角湾彩色建筑；到渔人码头别扎堆房子正面，去对面小吃摊一侧拍码头全貌、欧风渔港和黑色礁石。", duration: "2h", tags: ["视频优化", "地铁 5 号线"], booking: { level: "none", label: "无需门票" } },
      { time: "11:10", kind: "游玩", place: "燕窝岭 → 北大桥滨海栈道", detail: "按视频建议反向走：从燕窝岭往北大桥，整体以下坡为主；穿防滑运动鞋，烈日或雨后湿滑时缩短路段。", duration: "1.3h", tags: ["下坡省力", "山海栈道"], booking: { level: "none", label: "无需门票" } },
      { time: "12:50", kind: "午餐", place: "亚桥咖喱（中山区门店）", order: "炸鸡排咖喱饭／芝士咖喱饭，辣度保守选", detail: "经营年头久、咖喱浓郁，属于大连本地年轻人会反复吃的类型。不是地方菜，但如果喜欢日式咖喱，值得安排一顿。", duration: "1.2h", tags: ["值得吃", "人均约 ¥35–55"] },
      { time: "14:30", kind: "游玩", place: "中山广场 → 南山风情街 · 七七街", detail: "先绕中山广场看百年欧式建筑，再步行约 600 米进入南山。下午光线更适合拍老建筑；南山树荫、咖啡和杂货铺适合慢走。", duration: "2h", tags: ["Citywalk", "百年建筑"], booking: { level: "none", label: "无需门票" } },
      { time: "17:00", kind: "游玩", place: "东港 → 威尼斯水城", detail: "先走港浦路海边，等傍晚亮灯后再进水城；白天观感普通，亮灯后看一圈即可，贡多拉只在真想坐时现场决定。", duration: "2.2h", tags: ["亮灯后再去"], booking: { level: "none", label: "街区免票", note: "贡多拉游船另收费，非必选。" } },
      { time: "19:30", kind: "晚餐", place: "日丰园海肠水饺", order: "海肠水饺＋黄花鱼丸汤＋时令小菜", detail: "大连代表性很强的一顿，和中午咖喱不重复；热门时先线上取号。", duration: "1.5h", tags: ["必吃", "人均约 ¥80–120"] },
      { time: "21:10", kind: "甜品", place: "元叶丰茶", order: "酒酿米麻薯／厚蛋糕奶茶二选一", detail: "只当饭后甜品，不要把大杯奶茶当水喝。", duration: "35m", tags: ["可选"] },
    ],
  },
  {
    id: "d3", date: "8/6", weekday: "周四", city: "大连", title: "本地胃的一天", subtitle: "黑石礁、老电车与市中心慢走",
    tip: "鳗乐道不是大连特色，只有真想吃日料自助才保留；否则换成品海楼或附近大连老菜。",
    stops: [
      { time: "08:30", kind: "早餐", place: "天颜过桥米线", order: "鸡肉砂锅米线＋卤蛋，先尝原汤再加辣", detail: "老牌米线、汤底浓，网上口碑长期稳定。早午餐吃最合适，避开正午排队。", duration: "1h", tags: ["值得吃", "人均约 ¥20–35"] },
      { time: "10:00", kind: "游玩", place: "黑石礁海岸 → 大连自然博物馆", detail: "海边与室内组合，8 月中午前完成户外部分。大连市级博物馆个人参观已取消预约，带本人有效身份证件，遇限流则先走海岸。", duration: "2h", tags: ["雨天也可", "带身份证"], booking: { level: "none", label: "免票免预约", note: "个人参观带有效身份证件；团队另行联系馆方。" } },
      { time: "12:40", kind: "午餐", place: "鳗乐道 · 活鳗料理", order: "活烤鳗鱼＋三文鱼＋甜虾；少拿炸物", detail: "优势是约 200 元档自助选择多，不足是并非大连独有、容易占掉两小时。想吃就安排这天，不想吃可直接替换。", duration: "2h", tags: ["有条件推荐", "约 ¥194–218"] },
      { time: "15:20", kind: "游玩", place: "201 路有轨电车 → 劳动公园", detail: "坐一小段老电车感受城市，再进劳动公园散步。想看城市全景可现场加绿山缆车；前一天已登莲花山则不必重复登高。", duration: "1.8h", tags: ["城市体验", "不重复登高"], booking: { level: "none", label: "公园免票", note: "缆车为现场可选项目。" } },
      { time: "17:30", kind: "游玩", place: "港东五街", detail: "等轮船与城市同框；没有大船就当普通海边散步，不为一张照片长时间空等。", duration: "1.2h", tags: ["顺路", "不硬等"] },
      { time: "19:30", kind: "晚餐", place: "品海楼（中山区门店）", order: "海菜包子＋老板鱼炖豆腐＋一道时蔬", detail: "补一顿大连家常海鲜，菜量不小；两个人不要再点海鲜大拼盘。", duration: "1.3h", tags: ["大连老菜", "人均约 ¥90–140"] },
    ],
  },
  {
    id: "d4", date: "8/7", weekday: "周五", city: "大连 → 沈阳", title: "中午转场，晚上吃西塔", subtitle: "订到沈阳站比沈阳北站更省事",
    tip: "中午在高铁上吃轻食是刻意留胃；西塔正餐＋甜品很容易超量。",
    stops: [
      { time: "08:00", kind: "早餐", place: "酒店早餐", order: "面／粥＋水果", detail: "退房日不额外追店，把时间留给海边和交通。", duration: "40m", tags: ["省时"] },
      { time: "09:00", kind: "游玩", place: "星海广场晨走", detail: "百年城雕、海边栈道慢走一圈，回酒店取行李。", duration: "1h", tags: ["住处旁"] },
      { time: "10:20", kind: "交通", place: "前往大连北站", detail: "打车预留 50–60 分钟，目标车次约 11:30 发车、13:30 前抵达。", duration: "3h", tags: ["高铁"] },
      { time: "12:00", kind: "午餐", place: "高铁轻食", order: "饭团／三明治＋无糖饮料", detail: "这一顿故意吃轻，为西塔晚餐留胃。", duration: "30m", tags: ["交通餐"] },
      { time: "14:10", kind: "住宿", place: "沈阳站 · 太原街附近入住", city: "沈阳", detail: "华住会优先看沈阳站、太原街、西塔三角区；后面去铁西和西塔都方便。", duration: "1h", tags: ["华住会"] },
      { time: "16:00", kind: "甜品", place: "Just Start Coffee（西塔）", city: "沈阳", order: "黑芝麻维也纳／黑芝麻雪冰", detail: "来自你给的西塔咖啡笔记线索，院落氛围感强；营业时间出发前再核对。", duration: "1.2h", tags: ["小红书线索"] },
      { time: "18:00", kind: "晚餐", place: "西塔大冷面＋泥炉烤肉", city: "沈阳", order: "大冷面＋烤牛肉／五花肉＋拌花菜", detail: "先吃冷面再烤肉，两人不要再点参鸡汤；餐后到师任堂或韩百买一份打糕。", duration: "2.2h", tags: ["必去", "人均约 ¥100–160"] },
    ],
  },
  {
    id: "d5", date: "8/8", weekday: "周六", city: "沈阳", title: "铁西街区与甜品巡游", subtitle: "不逛景点，只逛店、喝咖啡",
    tip: "甜品店当天只选 1–2 家。杨草莓熊视频有较强种草属性，但店名、营业状态要按视频和地图当天复核。",
    stops: [
      { time: "09:00", kind: "早餐", place: "老四季抻面", order: "小碗抻面＋鸡架＋榨菜", detail: "沈阳经典早餐，鸡架掰碎拌醋和辣椒；一人半个鸡架足够。", duration: "1h", tags: ["沈阳味", "人均约 ¥20–30"] },
      { time: "10:30", kind: "游玩", place: "铁西 Citywalk", detail: "从红梅文创园一带开始，按咖啡、杂货店密度慢走；不专门参观展馆。", duration: "2h", tags: ["低景点密度"] },
      { time: "12:40", kind: "午餐", place: "金多咖喱", order: "欧姆蛋芝士咖喱／汉堡排咖喱", detail: "与铁西路线顺路，吃完再走咖啡店；和大连亚桥同类，若不想两次咖喱可换鸡架饭。", duration: "1h", tags: ["顺路", "人均约 ¥40–60"] },
      { time: "14:00", kind: "甜品", place: "杨草莓熊沈阳甜品线", order: "优先照视频当期单品点，不盲点整柜", detail: "已确认杨草莓熊 2026-02-18 发布沈阳甜品视频；评论区同城补充有安仔和莎窝、MISS C。主推荐店名请临行前按视频内字幕复核。", duration: "2h", tags: ["杨草莓熊", "重点核验"] },
      { time: "17:00", kind: "游玩", place: "太原街 · 青年大街商圈", detail: "逛商场、买伴手礼、回酒店休息，不安排故宫和大帅府。", duration: "2h", tags: ["逛街"] },
      { time: "19:30", kind: "晚餐", place: "群乐饭店", order: "锅包肉＋熘肝尖＋一份青菜", detail: "老沈阳家常菜，锅包肉趁热吃；两人两荤一素已经很多。排队太长则就近换东北家常菜。", duration: "1.3h", tags: ["东北菜", "人均约 ¥60–90"] },
    ],
  },
  {
    id: "d6", date: "8/9", weekday: "周日", city: "沈阳", title: "早市、咖啡与留白", subtitle: "给最后一天洗浴留体力",
    tip: "如果 8 月 10 日返京时间早于 19:30，把洗浴整段提前到今天 13:00。",
    stops: [
      { time: "08:00", kind: "早餐", place: "小河沿早市", order: "羊汤／馅饼＋油梭子火烧，边走边吃", detail: "属于生活体验而不是景点；周末人多，贵重物品放身前。", duration: "1.5h", tags: ["早市", "人均约 ¥25–45"] },
      { time: "10:30", kind: "游玩", place: "浑河边慢走", detail: "天气不热就走一段，太晒直接换商场或咖啡馆。", duration: "1.2h", tags: ["留白"] },
      { time: "12:30", kind: "午餐", place: "宝发园名菜馆", order: "四绝菜里选 2 道＋米饭", detail: "补一顿辽菜，菜量大；不为历史打卡，只为吃饭。", duration: "1.3h", tags: ["辽菜", "人均约 ¥80–120"] },
      { time: "14:30", kind: "甜品", place: "安仔和莎窝／MISS C（二选一）", order: "胡椒可可或苹果派；MISS C 选红丝绒／蒙布朗", detail: "这两家来自杨草莓熊沈阳视频评论区的高赞同城补充，不冒充博主本人推荐；选离当日位置近的一家。", duration: "1.3h", tags: ["评论区线索"] },
      { time: "17:00", kind: "游玩", place: "回酒店休息 · 整理行李", detail: "预先把洗浴过夜包和返京行李分开，明天退房后直接走。", duration: "1.5h", tags: ["整理"] },
      { time: "19:00", kind: "晚餐", place: "西塔参鸡汤", order: "参鸡汤＋海鲜饼，两人可共用一份饼", detail: "最后补西塔遗漏的一顿，口味与前一天东北菜错开。", duration: "1.3h", tags: ["暖胃", "人均约 ¥80–120"] },
    ],
  },
  {
    id: "d7", date: "8/10", weekday: "周一", city: "沈阳 → 北京", title: "最后泡进澡堂，再回北京", subtitle: "默认选择 20:30 后返京车次",
    tip: "这是按晚班高铁设计的默认方案。若返京更早，网页“洗浴”页里一键采用 8/9 提前版。",
    stops: [
      { time: "08:30", kind: "早餐", place: "酒店早餐", order: "粥／面＋鸡蛋，少油", detail: "退房、寄存或直接带行李去洗浴，提前电话确认大件行李存放。", duration: "50m", tags: ["退房"] },
      { time: "10:00", kind: "交通", place: "前往沐里沐外（天惠国际店）", detail: "相比清河半岛更适合返京日，离市区和交通枢纽更容易控制时间。", duration: "45m", tags: ["主方案"] },
      { time: "11:00", kind: "游玩", place: "沐里沐外洗浴", detail: "洗澡 → 搓澡 → 泡池 → 汗蒸 → 午餐 → 午睡。门票、搓澡和餐饮通常分开计价，以当日团购为准。", duration: "6h", tags: ["必去", "最后一站"], booking: { level: "recommended", label: "建议前一晚购票", note: "先确认票种、营业时间和大件行李存放；不是景区实名预约。" } },
      { time: "12:30", kind: "午餐", place: "洗浴内午餐", order: "东北菜／简餐＋水果，不点过量", detail: "先吃正餐再休息，避免只吃免费水果。", duration: "1h", tags: ["馆内解决"] },
      { time: "17:00", kind: "晚餐", place: "洗浴内轻食", order: "面／饺子，赶车则打包", detail: "17:30 前结账离场，按沈阳站车次至少预留 2 小时。", duration: "45m", tags: ["返京前"] },
      { time: "18:00", kind: "交通", place: "前往沈阳站 · 返回北京", detail: "建议 20:30 后车次；若从沈阳北站出发，再多留 20–30 分钟。", duration: "3h+", tags: ["返京"] },
    ],
  },
];

const places: Place[] = [
  { id: "xinghai", city: "大连", name: "星海广场", short: "住·星海", type: "住宿", x: 33, y: 76, note: "三晚住宿核心，连接西海岸与地铁。", order: 1 },
  { id: "riyue", city: "大连", name: "日月昇渔家菜（星海公园店）", short: "日月昇", type: "午餐", x: 26, y: 67, note: "落地第一顿，海肠捞饭最顺路。", order: 2 },
  { id: "sunset", city: "大连", name: "跨海大桥观景点", short: "日落", type: "风景", x: 45, y: 84, note: "8 月日落前 40 分钟抵达。", order: 3 },
  { id: "fisher", city: "大连", name: "渔人码头", short: "渔人码头", type: "海岸", x: 77, y: 55, note: "与菱角湾连续安排。", order: 4 },
  { id: "nanshan", city: "大连", name: "南山风情街", short: "南山", type: "街区", x: 66, y: 45, note: "午后树荫 Citywalk。", order: 5 },
  { id: "donggang", city: "大连", name: "东港·威尼斯水城", short: "东港", type: "夜景", x: 83, y: 25, note: "亮灯后离开，晚餐接日丰园。", order: 6 },
  { id: "xita", city: "沈阳", name: "西塔街", short: "西塔", type: "美食", x: 30, y: 43, note: "8/7 主线：咖啡、冷面、烤肉和打糕。", order: 1 },
  { id: "tiexi", city: "沈阳", name: "铁西 Citywalk", short: "铁西", type: "街区", x: 17, y: 65, note: "8/8 低景点密度闲逛。", order: 2 },
  { id: "taiyuan", city: "沈阳", name: "太原街", short: "太原街", type: "住宿", x: 38, y: 53, note: "建议住宿片区，往返西塔和车站方便。", order: 3 },
  { id: "muli", city: "沈阳", name: "沐里沐外（天惠国际店）", short: "沐里沐外", type: "洗浴", x: 53, y: 77, note: "返京日首选，时间比远郊清河半岛更可控。", order: 4 },
  { id: "qinghe", city: "沈阳", name: "清河半岛温泉", short: "清河半岛", type: "备选", x: 79, y: 18, note: "体量最大但较远，适合提前到 8/9 玩整天。", order: 5 },
];

const foodReviews = [
  { name: "日月昇渔家菜", score: "4.2", level: "值得吃", price: "¥90–130", area: "星海公园店", order: "海肠捞饭、鲅鱼水饺、软炸肉", verdict: "连锁但胜在顺路、菜量大、第一次吃大连家常海鲜不容易点偏。海鲜新鲜度可能随门店和时段波动。" },
  { name: "天颜过桥米线", score: "4.3", level: "值得吃", price: "¥20–35", area: "选离黑石礁顺路门店", order: "鸡肉砂锅米线、卤蛋", verdict: "汤浓、性价比高，是本地日常型小吃；不用跨城专程追，但放在早餐非常合适。" },
  { name: "亚桥咖喱", score: "4.5", level: "咖喱党必吃", price: "¥35–55", area: "中山区门店", order: "鸡排咖喱、芝士咖喱", verdict: "经营年头久，咖喱味浓且分量足。不是大连特色菜，但属于有城市记忆的本地小馆。" },
  { name: "鳗乐道 · 活鳗料理", score: "3.7", level: "有条件推荐", price: "¥194–218", area: "以地图最新门店为准", order: "现烤鳗鱼、三文鱼、甜虾", verdict: "想吃日料自助就值；若旅行目标是大连特色，它会占掉一顿正餐和两小时，可替换为大连老菜。" },
  { name: "日丰园海肠水饺", score: "4.6", level: "必吃", price: "¥80–120", area: "东港后顺路", order: "海肠水饺、黄花鱼丸汤", verdict: "辨识度高于普通海鲜店，建议优先保留。热门时排队明显，先取号再去附近散步。" },
  { name: "Just Start Coffee", score: "4.1", level: "氛围优先", price: "¥35–65", area: "沈阳西塔", order: "黑芝麻维也纳、黑芝麻雪冰", verdict: "与西塔主线高度顺路，适合下午休息拍照；来自用户提供的小红书笔记线索。" },
];

const swapOptions = [
  { category: "地方", city: "大连", name: "棒棰岛", use: "替换 D3 黑石礁半日", time: "半天", booking: "建议提前购票", level: "recommended", note: "海滩更干净、适合挖沙和慢走；旺季先查当日开放与交通。和老虎滩、金石滩不要塞在同一天。" },
  { category: "地方", city: "大连", name: "金石滩地质公园＋黄金海岸", use: "替换完整 D3", time: "一整天", booking: "建议提前购套票", level: "recommended", note: "适合想看海蚀地貌和玩水的人；离市区远，一旦采用就整天交给金石滩，不再保留市区老电车线。" },
  { category: "地方", city: "大连", name: "发现王国夜场", use: "接在金石滩之后", time: "傍晚至夜间", booking: "建议提前购票", level: "recommended", note: "只有选择金石滩整日版且仍有体力时再加；先查夜场开放、烟花和设备检修信息。" },
  { category: "地方", city: "大连", name: "旅顺口＋旅顺博物馆＋老铁山", use: "替换完整 D3", time: "一整天", booking: "博物馆个人免预约", level: "none", note: "适合历史兴趣更强的人。旅顺距离市区较远；博物馆带身份证，老铁山等收费点出发前查票务。" },
  { category: "地方", city: "大连", name: "老虎滩海洋公园", use: "亲子／海洋馆替换项", time: "4–6 小时", booking: "建议提前购票", level: "recommended", note: "本次主线只经过老虎滩片区，不进海洋馆。若采用，坐地铁 5 号线，不自驾去停车。" },
  { category: "地方", city: "大连", name: "西安路夜市", use: "替换任一大连晚餐", time: "1.5–2 小时", booking: "无需门票", level: "none", note: "选择多但踩雷概率也高；优先排队明显、现做现卖的摊位，不要和海鲜正餐叠加。" },
  { category: "美食", city: "大连", name: "西安路小吃组合", use: "替换 D2 或 D3 晚餐", time: "1 餐", booking: "无需预约", level: "none", note: "海胆饺子、三鲜焖子、铁板鱿鱼、烤生蚝中选 2–3 样分食；不要每样都买大份。" },
  { category: "美食", city: "大连", name: "渔人码头海鲜馆", use: "替换 D2 亚桥咖喱", time: "1 餐", booking: "热门店建议取号", level: "recommended", note: "想把咖喱换成本地海鲜时使用，优先海胆饺子和当日小海鲜；先问清时价、加工方式和份量。" },
  { category: "美食", city: "大连", name: "品海楼／附近大连老菜", use: "替换 D3 鳗乐道", time: "1 餐", booking: "饭点建议取号", level: "recommended", note: "更符合本地特色，但 D3 晚餐已经安排品海楼；替换午餐后，晚餐改成米线、焖子或清淡小吃，避免重复。" },
  { category: "美食", city: "沈阳", name: "鸡架饭／鸡架小吃", use: "替换 D5 金多咖喱", time: "1 餐", booking: "无需预约", level: "none", note: "如果不想大连、沈阳连续吃两顿咖喱，用鸡架类正好补一顿沈阳味。" },
];

const baths = [
  { id: "muli", name: "沐里沐外", price: "¥228–288", score: 86, location: "浑南 · 市区相对近", vibe: "设计感、年轻、适合返京日", food: "餐饮另算为主", sleep: "可休息／是否过夜看票种", best: "本行程首选", accent: "coral" },
  { id: "qinghe", name: "清河半岛", price: "¥238–298", score: 96, location: "沈北 · 距市区远", vibe: "体量最大、温泉度假感强", food: "套餐可能含餐，以团购为准", sleep: "适合整天或过夜", best: "8/9 提前版", accent: "blue" },
  { id: "yongli", name: "永利汇", price: "¥258–300", score: 80, location: "市区 · 交通较方便", vibe: "传统高配洗浴、吃喝选择多", food: "自助／单点看票种", sleep: "休息区成熟", best: "市区稳妥备选", accent: "gold" },
];

const checklist = ["身份证与返京车票", "大连→沈阳高铁票", "华住会旺季可取消订单", "防晒、帽子、墨镜", "薄外套（海边晚风）", "防滑拖鞋／泳衣", "洗浴过夜小包", "充电宝与肠胃药"];

const sources = [
  { label: "大连合法但不太正常的行为 · 小红书", href: "http://xhslink.cn/o/Ywvef7JKQv" },
  { label: "大连现状与三天路线 · 小红书", href: "http://xhslink.cn/o/8NrhqYELyRa" },
  { label: "大连旅游注意事项 · 哔哩哔哩", href: "https://b23.tv/u0GjSYB" },
  { label: "杨草莓熊 · 沈阳甜品视频", href: "https://www.bilibili.com/video/BV1CVZtB8E6t/" },
  { label: "杨草莓熊 · 大连面包视频", href: "https://www.bilibili.com/video/BV1bFreB1EjG/" },
  { label: "大连松弛看海笔记", href: "http://xhslink.cn/o/4s4dVH6LrNC" },
  { label: "西塔咖啡笔记", href: "http://xhslink.cn/o/8oQfRBslKxx" },
  { label: "铁西 Citywalk 笔记", href: "http://xhslink.cn/o/38I8jRaYyLk" },
];

function navLink(name: string, city: string) {
  return `https://uri.amap.com/search?keyword=${encodeURIComponent(name)}&city=${encodeURIComponent(city)}&view=map`;
}

export default function Home() {
  const [activeDay, setActiveDay] = useState("d1");
  const [section, setSection] = useState<Section>("plan");
  const [mapCity, setMapCity] = useState<City>("大连");
  const [selectedPlace, setSelectedPlace] = useState("xinghai");
  const [done, setDone] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [checked, setChecked] = useState<string[]>([]);
  const [selectedBath, setSelectedBath] = useState("muli");

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      const read = (key: string) => JSON.parse(localStorage.getItem(key) || "[]");
      setDone(read("trip-2026-done"));
      setSaved(read("trip-2026-saved"));
      setChecked(read("trip-2026-checked"));
      setSelectedBath(localStorage.getItem("trip-2026-bath") || "muli");
    });
    return () => { active = false; };
  }, []);

  const day = days.find((item) => item.id === activeDay)!;
  const totalStops = days.reduce((sum, item) => sum + item.stops.length, 0);
  const progress = Math.round((done.length / totalStops) * 100);
  const mapPlaces = useMemo(() => places.filter((place) => place.city === mapCity), [mapCity]);
  const selected = places.find((place) => place.id === selectedPlace) || mapPlaces[0];

  function toggle(value: string, values: string[], setter: (items: string[]) => void, key: string) {
    const next = values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
    setter(next);
    localStorage.setItem(key, JSON.stringify(next));
  }

  function chooseDay(id: string) {
    const next = days.find((item) => item.id === id)!;
    setActiveDay(id);
    setSection("plan");
    setMapCity(next.city.includes("沈阳") && !next.city.startsWith("大连") ? "沈阳" : "大连");
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <div className="hero-glow" />
        <div className="hero-top">
          <span className="eyebrow"><i /> LIAONING · SUMMER 2026</span>
          <button className="progress-orb" aria-label="旅行完成度"><b>{progress}%</b><small>完成</small></button>
        </div>
        <div className="hero-copy">
          <span>08.04 — 08.10</span>
          <h1>海风作序，<br /><em>盛京收尾。</em></h1>
          <p>大连 3 晚 · 沈阳 3 晚 · 7 天慢游</p>
        </div>
        <div className="route-ribbon">
          <div><small>ARRIVE</small><strong>8/4 中午 · 大连</strong></div>
          <i>→</i>
          <div><small>TRANSFER</small><strong>8/7 中午 · 沈阳</strong></div>
          <i>→</i>
          <div><small>RETURN</small><strong>8/10 · 北京</strong></div>
        </div>
      </header>

      <section className="day-strip" aria-label="选择行程日期">
        {days.map((item, index) => (
          <button key={item.id} className={activeDay === item.id ? "active" : ""} onClick={() => chooseDay(item.id)}>
            <small>{item.weekday}</small><strong>{item.date}</strong><span>D{index + 1}</span>
          </button>
        ))}
      </section>

      {section === "plan" && (
        <section className="content-section">
          <div className="day-intro">
            <div><span>{day.city}</span><h2>{day.title}</h2><p>{day.subtitle}</p></div>
            <button onClick={() => setSection("map")}>路线图 <b>↗</b></button>
          </div>
          <div className="timeline">
            {day.stops.map((stop, index) => {
              const key = `${day.id}-${index}`;
              const city = stop.city || (day.city.includes("沈阳") && !day.city.startsWith("大连") ? "沈阳" : "大连");
              return (
                <article className={`stop-card ${done.includes(key) ? "completed" : ""}`} key={key}>
                  <div className="time-col"><strong>{stop.time}</strong><span>{stop.duration}</span></div>
                  <div className="timeline-pin"><i /></div>
                  <div className="stop-body">
                    <div className="stop-head"><span className={`kind ${stop.kind}`}>{stop.kind}</span><button aria-label={`收藏 ${stop.place}`} className={saved.includes(stop.place) ? "saved" : ""} onClick={() => toggle(stop.place, saved, setSaved, "trip-2026-saved")}>{saved.includes(stop.place) ? "♥" : "♡"}</button></div>
                    <h3>{stop.place}</h3>
                    {stop.order && <div className="order-box"><small>点单</small><b>{stop.order}</b></div>}
                    {stop.booking && <div className={`booking-note ${stop.booking.level}`}><strong>{stop.booking.level === "required" ? "需提前预约" : stop.booking.level === "recommended" ? "提前安排" : "票务"}</strong><span>{stop.booking.label}</span>{stop.booking.note && <small>{stop.booking.note}</small>}</div>}
                    <p>{stop.detail}</p>
                    <div className="card-actions">
                      <div>{stop.tags?.map((tag) => <span key={tag}>{tag}</span>)}</div>
                      <a href={navLink(stop.place, city)} target="_blank" rel="noreferrer">导航</a>
                      <button onClick={() => toggle(key, done, setDone, "trip-2026-done")}>{done.includes(key) ? "已完成 ✓" : "完成"}</button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <aside className="day-tip"><span>NOTE</span><p>{day.tip}</p></aside>
        </section>
      )}

      {section === "map" && (
        <section className="content-section">
          <div className="section-title"><span>ROUTE MAP</span><h2>不折返的方位图</h2><p>点击标记查看说明，实际出发用高德导航</p></div>
          <div className="city-toggle">
            {(["大连", "沈阳"] as City[]).map((city) => <button key={city} className={mapCity === city ? "active" : ""} onClick={() => { setMapCity(city); setSelectedPlace(places.find((place) => place.city === city)!.id); }}>{city}</button>)}
          </div>
          <div className={`route-map ${mapCity === "沈阳" ? "shenyang" : "dalian"}`}>
            <span className="map-water">{mapCity === "大连" ? "黄 海" : "浑 河"}</span>
            <i className="road road-a" /><i className="road road-b" /><i className="road road-c" />
            {mapPlaces.map((place) => (
              <button key={place.id} aria-label={place.name} className={`map-marker ${selected.id === place.id ? "selected" : ""}`} style={{ left: `${place.x}%`, top: `${place.y}%` }} onClick={() => setSelectedPlace(place.id)}>
                <i>{place.order}</i><span>{place.short}</span>
              </button>
            ))}
            <b className="compass">N<br />↑</b>
          </div>
          <article className="place-sheet"><span>{selected.type.slice(0, 1)}</span><div><small>{selected.city} · {selected.type}</small><h3>{selected.name}</h3><p>{selected.note}</p></div><a href={navLink(selected.name, selected.city)} target="_blank" rel="noreferrer">导航</a></article>
        </section>
      )}

      {section === "food" && (
        <section className="content-section">
          <div className="section-title"><span>EAT LIST</span><h2>值得吃，不为打卡绕路</h2><p>价格为近期人均参考，8 月旺季以门店当天为准</p></div>
          <div className="food-grid">
            {foodReviews.map((item) => (
              <article className="food-card" key={item.name}>
                <div className="food-top"><div><small>{item.area}</small><h3>{item.name}</h3></div><b>{item.score}</b></div>
                <div className="food-meta"><span>{item.level}</span><span>{item.price}</span></div>
                <div className="must-order"><small>建议点</small><strong>{item.order}</strong></div>
                <p>{item.verdict}</p>
                <a href={navLink(item.name, item.name.includes("Just") ? "沈阳" : "大连")} target="_blank" rel="noreferrer">打开地图 ↗</a>
              </article>
            ))}
          </div>
          <div className="source-box"><span>视频与参考链接</span><p>大连主线已按三条新视频重新对照；沈阳甜品视频未在网页标题公开店名，因此没有把评论区店名冒充成博主推荐。</p>{sources.map((source) => <a key={source.href} href={source.href} target="_blank" rel="noreferrer">{source.label}<b>↗</b></a>)}</div>
        </section>
      )}

      {section === "swap" && (
        <section className="content-section">
          <div className="section-title"><span>SWAP POOL</span><h2>没进主线的备选池</h2><p>按“替换”使用，不往主线继续叠加；地方和美食放在一起，临时换更方便</p></div>
          <aside className="booking-summary">
            <span>预约结论</span>
            <h3>主线没有必须提前抢的景区票</h3>
            <p>莲花山走免费步道；大连自然博物馆个人免票免预约、带身份证。沐里沐外建议前一晚确认票种。备选中的收费大景区在暑期建议提前购票，但都不是主线的硬性预约项。</p>
          </aside>
          <div className="swap-grid">
            {swapOptions.map((item) => (
              <article className="swap-card" key={item.name}>
                <div className="swap-top"><span>{item.category} · {item.city}</span><b>{item.time}</b></div>
                <h3>{item.name}</h3>
                <div className="swap-use"><small>替换方式</small><strong>{item.use}</strong></div>
                <div className={`swap-booking ${item.level}`}>{item.booking}</div>
                <p>{item.note}</p>
                <a href={navLink(item.name, item.city)} target="_blank" rel="noreferrer">打开地图 ↗</a>
              </article>
            ))}
          </div>
        </section>
      )}

      {section === "bath" && (
        <section className="content-section">
          <div className="section-title"><span>BATH LAB</span><h2>¥200–300 洗浴怎么选</h2><p>门票、搓澡、餐饮经常拆分售卖，以下按近期常见组合价估算</p></div>
          <div className="bath-chart">
            {baths.map((bath) => (
              <button key={bath.id} className={`${bath.accent} ${selectedBath === bath.id ? "active" : ""}`} onClick={() => { setSelectedBath(bath.id); localStorage.setItem("trip-2026-bath", bath.id); }}>
                <div><span>{bath.name}</span><strong>{bath.price}</strong></div>
                <i><b style={{ width: `${bath.score}%` }} /></i>
                <small>综合匹配 {bath.score}</small>
              </button>
            ))}
          </div>
          {baths.filter((bath) => bath.id === selectedBath).map((bath) => (
            <article className="bath-detail" key={bath.id}>
              <div className="bath-badge">{bath.best}</div><h3>{bath.name}</h3>
              <dl><div><dt>位置</dt><dd>{bath.location}</dd></div><div><dt>氛围</dt><dd>{bath.vibe}</dd></div><div><dt>餐食</dt><dd>{bath.food}</dd></div><div><dt>休息</dt><dd>{bath.sleep}</dd></div></dl>
              <a href={navLink(bath.name, "沈阳")} target="_blank" rel="noreferrer">去高德确认团购与营业时间 ↗</a>
            </article>
          ))}
          <aside className="bath-plan"><span>默认方案</span><h3>8/10 沐里沐外 → 晚班高铁</h3><p>如果返京时间早于 19:30，把洗浴改到 8/9 13:00，并选清河半岛玩整天；不要在返京日硬冲远郊。</p></aside>
        </section>
      )}

      {section === "list" && (
        <section className="content-section">
          <div className="section-title"><span>BEFORE GO</span><h2>出发清单</h2><p>{checked.length}/{checklist.length} 已准备 · 收藏 {saved.length} 个地点</p></div>
          <div className="check-progress"><i style={{ width: `${checked.length / checklist.length * 100}%` }} /></div>
          <div className="checklist">{checklist.map((item) => <label key={item} className={checked.includes(item) ? "checked" : ""}><input type="checkbox" checked={checked.includes(item)} onChange={() => toggle(item, checked, setChecked, "trip-2026-checked")} /><i>{checked.includes(item) ? "✓" : ""}</i><span>{item}</span></label>)}</div>
          <div className="saved-box"><span>MY SAVES</span><h3>收藏地点</h3>{saved.length ? <div>{saved.map((item) => <button key={item} onClick={() => toggle(item, saved, setSaved, "trip-2026-saved")}>{item} ×</button>)}</div> : <p>在日程卡片点 ♡，地点会保存在这里。</p>}</div>
          <div className="hotel-box"><span>华住会建议</span><h3>大连住星海，沈阳住太原街</h3><p>大连保持原来的星海广场住宿最合理；沈阳选沈阳站—太原街—西塔三角区，去西塔、铁西和返京都顺。</p><a href="https://m.huazhu.com/" target="_blank" rel="noreferrer">去华住会查可取消价 ↗</a></div>
        </section>
      )}

      <nav className="bottom-nav" aria-label="主要功能">
        {([
          ["plan", "⌁", "日程"], ["map", "⌖", "地图"], ["food", "◌", "吃喝"], ["swap", "⇄", "备选"], ["bath", "♨", "洗浴"], ["list", "✓", "清单"],
        ] as [Section, string, string][]).map(([id, icon, label]) => <button key={id} className={section === id ? "active" : ""} onClick={() => setSection(id)}><i>{icon}</i><span>{label}</span></button>)}
      </nav>
    </main>
  );
}
