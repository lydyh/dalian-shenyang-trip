"use client";

import { useEffect, useMemo, useState } from "react";

type Place = {
  id: string;
  city: "大连" | "沈阳";
  name: string;
  short: string;
  type: string;
  x: number;
  y: number;
  note: string;
  order: number;
};

type Stop = {
  time: string;
  place: string;
  detail: string;
  duration: string;
  tags?: string[];
  food?: string;
};

const places: Place[] = [
  { id: "xinghai", city: "大连", name: "星海广场", short: "星海", type: "住宿", x: 38, y: 72, note: "住宿核心区，D3 清晨散步最舒服。", order: 1 },
  { id: "fujiazhuang", city: "大连", name: "付家庄海滨浴场", short: "付家庄", type: "海岸", x: 52, y: 65, note: "第一天下午从这里开始沿海慢走。", order: 2 },
  { id: "lianhuashan", city: "大连", name: "莲花山观景台", short: "莲花山", type: "观景", x: 44, y: 52, note: "缆车遇大风可能停运，晚到可跳过。", order: 3 },
  { id: "yinshatan", city: "大连", name: "银沙滩", short: "银沙滩", type: "海岸", x: 59, y: 77, note: "安静、适合拍照，日落前离开去桥景点。", order: 4 },
  { id: "bridge", city: "大连", name: "星海湾跨海大桥观景点", short: "大桥日落", type: "日落", x: 49, y: 86, note: "建议日落前 40 分钟到。", order: 5 },
  { id: "lingjiao", city: "大连", name: "菱角湾", short: "菱角湾", type: "海岸", x: 73, y: 45, note: "定位背光咖啡，附近小路看老虎滩彩色建筑。", order: 1 },
  { id: "fisher", city: "大连", name: "渔人码头", short: "渔人码头", type: "码头", x: 80, y: 52, note: "灯塔、渔船和老建筑，上午光线更好。", order: 2 },
  { id: "hupo", city: "大连", name: "琥珀湾", short: "琥珀湾", type: "海岸", x: 86, y: 43, note: "风大时缩短停留，沿海散步即可。", order: 3 },
  { id: "donggang", city: "大连", name: "东港·威尼斯水城", short: "东港", type: "夜景", x: 86, y: 23, note: "傍晚到，亮灯后离开。", order: 4 },
  { id: "dalianbei", city: "大连", name: "大连北站", short: "大连北", type: "交通", x: 50, y: 10, note: "从星海广场出发预留 45–60 分钟。", order: 6 },
  { id: "xita", city: "沈阳", name: "西塔街", short: "西塔", type: "美食", x: 34, y: 44, note: "冷面、烤肉、参鸡汤和韩国超市集中在这里。", order: 1 },
  { id: "juststart", city: "沈阳", name: "Just Start 咖啡", short: "Just Start", type: "甜品", x: 29, y: 38, note: "黑芝麻维也纳、黑芝麻雪冰、薄巧小房子。", order: 2 },
  { id: "palace", city: "沈阳", name: "沈阳故宫", short: "故宫", type: "人文", x: 63, y: 51, note: "D4 上午主行程，建议开门后尽早进入。", order: 1 },
  { id: "zhang", city: "沈阳", name: "张学良旧居", short: "大帅府", type: "人文", x: 68, y: 58, note: "与故宫步行衔接，不想连逛可跳过。", order: 2 },
  { id: "zhongjie", city: "沈阳", name: "中街", short: "中街", type: "街区", x: 72, y: 45, note: "午餐和买伴手礼，别吃太撑。", order: 3 },
  { id: "qinghe", city: "沈阳", name: "清河半岛温泉", short: "清河半岛", type: "洗浴", x: 78, y: 13, note: "最终站，至少留 5–6 小时；返程预留交通时间。", order: 4 },
  { id: "ciwei", city: "沈阳", name: "刺猬咖啡", short: "刺猬咖啡", type: "替换", x: 23, y: 62, note: "铁西替换线第一站：季节特调、花椒司康。", order: 1 },
  { id: "jinduo", city: "沈阳", name: "金多咖喱", short: "金多咖喱", type: "替换", x: 17, y: 68, note: "欧姆蛋芝士咖喱，距刺猬咖啡步行约 10 分钟。", order: 2 },
  { id: "xingxing", city: "沈阳", name: "星星商店", short: "星星商店", type: "替换", x: 13, y: 73, note: "饰品、帽子和玩偶，离金多咖喱很近。", order: 3 },
];

const days: { id: string; label: string; date: string; city: string; title: string; subtitle: string; stops: Stop[] }[] = [
  {
    id: "d1", label: "D1", date: "抵达日", city: "大连", title: "西海岸 · 追一场日落", subtitle: "慢慢走，不赶景点", stops: [
      { time: "12:00", place: "抵达 & 入住星海广场", detail: "放行李、简单休整。午餐想吃当地代表可去喜鼎海胆水饺，热门时先取号。", duration: "2h", tags: ["入住", "午餐"], food: "海胆水饺 / 三鲜焖子" },
      { time: "14:00", place: "付家庄海滨浴场", detail: "沿海边散步，作为第一天下午的轻松开场。", duration: "1h", tags: ["看海"] },
      { time: "15:20", place: "莲花山观景台", detail: "坐缆车上山俯瞰海湾；晚到或大风停运就直接跳过。", duration: "1.2h", tags: ["缆车", "可跳过"] },
      { time: "16:50", place: "银沙滩", detail: "海岸更安静，拍完照前往跨海大桥观景点。", duration: "50m", tags: ["拍照"] },
      { time: "18:10", place: "跨海大桥观景点", detail: "按当天日落时间前移或后移，建议提前 40 分钟抵达。", duration: "1h", tags: ["日落", "重点"] },
      { time: "20:00", place: "星海广场晚餐", detail: "海鲜烧烤或海肠捞饭，第一天不必再跨区。", duration: "1.5h", food: "海鲜烧烤 / 海肠捞饭" },
    ],
  },
  {
    id: "d2", label: "D2", date: "完整日", city: "大连", title: "东海岸 · 渔港与灯塔", subtitle: "从彩色海岸走到港口夜景", stops: [
      { time: "08:30", place: "菱角湾", detail: "打车定位“背光咖啡”，从附近小路看老虎滩彩色建筑。", duration: "1.5h", tags: ["拍照", "看海"] },
      { time: "10:30", place: "渔人码头", detail: "灯塔、渔船和老建筑；找间海景咖啡馆休息。", duration: "2h", tags: ["码头", "咖啡"] },
      { time: "12:30", place: "海边午餐", detail: "可选阿水的生鱼饭；不吃生食就点炙烤鳗鱼饭，或就近吃海鲜家常菜。", duration: "1.5h", food: "生鱼饭 / 炙烤鳗鱼饭 / 海菜包子" },
      { time: "14:30", place: "琥珀湾", detail: "继续沿海散步，风大时缩短停留。", duration: "1h", tags: ["松弛"] },
      { time: "16:30", place: "东港 · 威尼斯水城", detail: "先走港浦路海边，再等水城亮灯。", duration: "3h", tags: ["夜景"] },
      { time: "20:00", place: "元叶丰茶", detail: "把酒酿米麻薯当作饭后甜品，别和正餐顺序放反。", duration: "40m", food: "酒酿米麻薯 / 厚蛋糕奶茶" },
    ],
  },
  {
    id: "d3", label: "D3", date: "转场日", city: "大连 → 沈阳", title: "从海边醒来，去西塔吃饭", subtitle: "高铁优先选到沈阳站", stops: [
      { time: "07:30", place: "星海广场晨走", detail: "百年城雕、海边栈道，避开旅行团。", duration: "1h", tags: ["清晨"] },
      { time: "09:00", place: "前往大连北站", detail: "从星海出发预留 45–60 分钟，选 11:30–12:30 抵达沈阳站的车次。", duration: "3h", tags: ["高铁"] },
      { time: "12:30", place: "沈阳站附近入住", detail: "建议住沈阳站—太原街—西塔区域，华住会筛选地铁 500 米内新店。", duration: "1h", tags: ["入住"] },
      { time: "14:00", place: "西塔街 & 韩国超市", detail: "先逛西塔街、韩百商场，把正餐留到傍晚。", duration: "2h", tags: ["必去", "街区"] },
      { time: "16:00", place: "Just Start 咖啡", detail: "院子适合下午拍照；临行前再核对地图定位和营业时间。", duration: "1.5h", tags: ["甜品"], food: "黑芝麻维也纳 / 黑芝麻雪冰" },
      { time: "18:00", place: "西塔晚餐", detail: "冷面、烤肉、参鸡汤三选二，留一点胃给打糕。", duration: "2h", food: "西塔大冷面 / 泥炉烤肉 / 打糕" },
    ],
  },
  {
    id: "d4", label: "D4", date: "最后日", city: "沈阳", title: "盛京老城，最后泡进澡堂", subtitle: "洗浴至少留 5–6 小时", stops: [
      { time: "09:00", place: "沈阳故宫", detail: "开门后尽早进入，逛核心建筑即可。", duration: "2h", tags: ["人文", "主线"] },
      { time: "11:10", place: "张学良旧居", detail: "与故宫步行衔接；不想连续参观可以直接去中街。", duration: "1.2h", tags: ["可跳过"] },
      { time: "12:30", place: "中街午餐", detail: "一道主食加一道小吃就够，下午洗浴不要吃太撑。", duration: "1.2h", food: "老边饺子 / 马家烧麦 / 鸡架" },
      { time: "14:00", place: "前往清河半岛", detail: "从中街打车预留 40–60 分钟，行李提前确认寄存。", duration: "1h", tags: ["交通"] },
      { time: "15:00", place: "清河半岛温泉洗浴", detail: "洗澡 → 搓澡 → 泡池 → 汗蒸 → 晚餐 → 休息。赶车至少提前 2.5–3 小时离开。", duration: "6h", tags: ["必去", "最终站"], food: "洗浴内晚餐" },
    ],
  },
];

const alternatives = [
  {
    id: "tiexi",
    title: "D4 上午 · 铁西 Citywalk",
    weather: "咖啡店与街区",
    replaces: "替换「故宫—大帅府—中街」",
    accent: "amber",
    stops: ["10:00 刺猬咖啡", "11:30 金多咖喱", "12:40 星星商店", "14:00 前往清河半岛"],
    note: "适合对历史景点兴趣一般、想逛年轻街区的人。不要和故宫线硬塞在同一上午。",
  },
  {
    id: "rainy",
    title: "大连雨天 · 室内缓冲",
    weather: "下雨 / 大风",
    replaces: "替换 D2 海岸长走",
    accent: "blue",
    stops: ["自然博物馆", "黑石礁书店或咖啡", "东港商场", "雨停后星海广场"],
    note: "大连海边大风时体验会明显下降，室内方案比硬走海岸更舒服。",
  },
  {
    id: "shortbath",
    title: "D4 · 市区洗浴版",
    weather: "晚间赶车",
    replaces: "替换远郊清河半岛",
    accent: "green",
    stops: ["故宫或铁西二选一", "市区午餐", "就近大型洗浴", "提前 2 小时去车站"],
    note: "如果最后一天晚上较早离开，优先保证返程，不建议跨城去清河半岛。",
  },
];

const checklist = ["身份证 / 车票", "充电宝与数据线", "舒适防滑鞋", "防晒与墨镜", "薄外套（海边风大）", "泳衣与换洗衣物", "洗浴过夜用品", "少量肠胃药"];

function navLink(name: string, city: string) {
  return `https://uri.amap.com/search?keyword=${encodeURIComponent(name)}&city=${encodeURIComponent(city)}&view=map`;
}

export default function Home() {
  const [activeDay, setActiveDay] = useState("d1");
  const [section, setSection] = useState<"plan" | "map" | "swap" | "list">("plan");
  const [mapCity, setMapCity] = useState<"大连" | "沈阳">("大连");
  const [selectedPlace, setSelectedPlace] = useState("xinghai");
  const [done, setDone] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [checked, setChecked] = useState<string[]>([]);
  const [activeSwap, setActiveSwap] = useState<string | null>(null);

  useEffect(() => {
    const read = (key: string) => JSON.parse(localStorage.getItem(key) || "[]");
    setDone(read("trip-done"));
    setSaved(read("trip-saved"));
    setChecked(read("trip-checked"));
    setActiveSwap(localStorage.getItem("trip-swap"));
  }, []);

  function persist(key: string, value: string[]) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function toggleValue(value: string, values: string[], setter: (v: string[]) => void, key: string) {
    const next = values.includes(value) ? values.filter((v) => v !== value) : [...values, value];
    setter(next);
    persist(key, next);
  }

  function chooseDay(id: string) {
    setActiveDay(id);
    const day = days.find((item) => item.id === id)!;
    setMapCity(day.city.includes("沈阳") && !day.city.startsWith("大连") ? "沈阳" : "大连");
  }

  const day = days.find((item) => item.id === activeDay)!;
  const mapPlaces = useMemo(() => places.filter((place) => place.city === mapCity), [mapCity]);
  const selected = places.find((place) => place.id === selectedPlace) || mapPlaces[0];
  const progress = Math.round((done.length / 21) * 100);

  return (
    <main className="app-shell">
      <header className="hero">
        <div className="hero-top">
          <div className="eyebrow"><span /> 辽宁 · 4日慢游</div>
          <button className="avatar-button" aria-label="旅行完成度"><b>{progress}%</b></button>
        </div>
        <h1>从海风里出发，<br /><em>泡进盛京的夜。</em></h1>
        <div className="trip-meta">
          <div><small>路线</small><strong>大连 → 沈阳</strong></div>
          <i />
          <div><small>节奏</small><strong>松弛不折返</strong></div>
          <i />
          <div><small>住宿</small><strong>星海广场</strong></div>
        </div>
      </header>

      <section className="day-strip" aria-label="选择行程日期">
        {days.map((item) => (
          <button key={item.id} className={activeDay === item.id ? "active" : ""} onClick={() => chooseDay(item.id)}>
            <span>{item.label}</span><small>{item.date}</small>
          </button>
        ))}
      </section>

      {section === "plan" && (
        <section className="content-section plan-section">
          <div className="section-heading">
            <div><span>{day.city}</span><h2>{day.title}</h2><p>{day.subtitle}</p></div>
            <button className="map-jump" onClick={() => setSection("map")}>看地图 ↗</button>
          </div>
          <div className="timeline">
            {day.stops.map((stop, index) => {
              const key = `${day.id}-${index}`;
              return (
                <article className={`stop-card ${done.includes(key) ? "completed" : ""}`} key={key}>
                  <div className="time-col"><strong>{stop.time}</strong><span>{stop.duration}</span></div>
                  <div className="timeline-dot"><i /></div>
                  <div className="stop-content">
                    <div className="stop-top">
                      <h3>{stop.place}</h3>
                      <button aria-label="收藏地点" className={saved.includes(stop.place) ? "saved" : ""} onClick={() => toggleValue(stop.place, saved, setSaved, "trip-saved")}>♡</button>
                    </div>
                    <p>{stop.detail}</p>
                    {stop.food && <div className="food-note">⌁ {stop.food}</div>}
                    <div className="tag-row">
                      {stop.tags?.map((tag) => <span key={tag}>{tag}</span>)}
                      <a href={navLink(stop.place, day.city.includes("沈阳") ? "沈阳" : "大连")} target="_blank" rel="noreferrer">导航</a>
                      <button onClick={() => toggleValue(key, done, setDone, "trip-done")}>{done.includes(key) ? "已去 ✓" : "标记已去"}</button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="day-tip"><b>今天的小提醒</b><p>{activeDay === "d1" ? "日落时间会随季节变化，出发当天把最后两站时间一起调整。" : activeDay === "d2" ? "海边大风时不要硬走全程，雨天方案已经放在「替换」里。" : activeDay === "d3" ? "订票优先到沈阳站，去西塔比沈阳北站更省时间。" : "洗浴放在最后一站，返程交通要倒推，别在里面睡过头。"}</p></div>
        </section>
      )}

      {section === "map" && (
        <section className="content-section map-section">
          <div className="section-heading compact">
            <div><span>ROUTE MAP</span><h2>点一下，看看在哪</h2></div>
            <div className="city-toggle">
              {(["大连", "沈阳"] as const).map((city) => <button key={city} className={mapCity === city ? "active" : ""} onClick={() => { setMapCity(city); setSelectedPlace(places.find((p) => p.city === city)!.id); }}>{city}</button>)}
            </div>
          </div>
          <div className={`route-map ${mapCity === "沈阳" ? "shenyang" : "dalian"}`}>
            <div className="map-water">{mapCity === "大连" ? "黄 海" : "浑 河"}</div>
            <div className="map-road road-a" /><div className="map-road road-b" /><div className="map-road road-c" />
            {mapPlaces.map((place) => (
              <button
                key={place.id}
                className={`map-marker ${selectedPlace === place.id ? "selected" : ""} ${place.type === "替换" ? "alternate" : ""}`}
                style={{ left: `${place.x}%`, top: `${place.y}%` }}
                onClick={() => setSelectedPlace(place.id)}
                aria-label={place.name}
              >
                <i>{place.order}</i><span>{place.short}</span>
              </button>
            ))}
            <div className="map-compass">N<br /><i>↑</i></div>
          </div>
          <article className="place-sheet">
            <div className="place-icon">{selected.type.slice(0, 1)}</div>
            <div><small>{selected.city} · {selected.type}</small><h3>{selected.name}</h3><p>{selected.note}</p></div>
            <a href={navLink(selected.name, selected.city)} target="_blank" rel="noreferrer">去导航</a>
          </article>
          <p className="map-disclaimer">示意图用于理解方位与路线顺序，实际导航请打开高德地图。</p>
        </section>
      )}

      {section === "swap" && (
        <section className="content-section swap-section">
          <div className="section-heading"><div><span>PLAN B</span><h2>换条路线，也很好</h2><p>按天气、兴趣和返程时间替换</p></div></div>
          <div className="swap-list">
            {alternatives.map((item) => (
              <article className={`swap-card ${item.accent} ${activeSwap === item.id ? "chosen" : ""}`} key={item.id}>
                <div className="swap-label">{item.weather}</div>
                <h3>{item.title}</h3>
                <p className="replace-note">{item.replaces}</p>
                <ol>{item.stops.map((stop) => <li key={stop}>{stop}</li>)}</ol>
                <p>{item.note}</p>
                <button onClick={() => { const next = activeSwap === item.id ? null : item.id; setActiveSwap(next); if (next) localStorage.setItem("trip-swap", next); else localStorage.removeItem("trip-swap"); }}>{activeSwap === item.id ? "已选用 · 取消" : "选用这个方案"}</button>
              </article>
            ))}
          </div>
        </section>
      )}

      {section === "list" && (
        <section className="content-section list-section">
          <div className="section-heading"><div><span>BEFORE GO</span><h2>出发前，再看一眼</h2><p>{checked.length}/{checklist.length} 已准备</p></div></div>
          <div className="progress-track"><i style={{ width: `${checked.length / checklist.length * 100}%` }} /></div>
          <div className="checklist">
            {checklist.map((item) => (
              <label key={item} className={checked.includes(item) ? "checked" : ""}>
                <input type="checkbox" checked={checked.includes(item)} onChange={() => toggleValue(item, checked, setChecked, "trip-checked")} />
                <i>{checked.includes(item) ? "✓" : ""}</i><span>{item}</span>
              </label>
            ))}
          </div>
          <div className="saved-box">
            <div><span>MY SAVES</span><h3>收藏地点</h3></div>
            {saved.length ? <div className="saved-tags">{saved.map((item) => <button key={item} onClick={() => toggleValue(item, saved, setSaved, "trip-saved")}>{item} ×</button>)}</div> : <p>在行程卡片点 ♡，地点会保存在这里。</p>}
          </div>
          <div className="hotel-card">
            <small>华住会住宿首选</small><h3>大连星海广场漫心酒店</h3><p>地铁和星海广场都方便；备选全季星海广场海景、全季星海会展中心。</p>
            <a href="https://m.huazhu.com/huazhu-DALIAN" target="_blank" rel="noreferrer">去华住会查看房价 ↗</a>
          </div>
        </section>
      )}

      <nav className="bottom-nav">
        <button className={section === "plan" ? "active" : ""} onClick={() => setSection("plan")}><i>⌁</i><span>行程</span></button>
        <button className={section === "map" ? "active" : ""} onClick={() => setSection("map")}><i>⌖</i><span>地图</span></button>
        <button className={section === "swap" ? "active" : ""} onClick={() => setSection("swap")}><i>⇄</i><span>替换</span>{activeSwap && <b />}</button>
        <button className={section === "list" ? "active" : ""} onClick={() => setSection("list")}><i>✓</i><span>清单</span></button>
      </nav>
    </main>
  );
}
