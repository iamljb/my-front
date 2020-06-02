/*
 * @Author: your name
 * @Date: 2020-05-28 09:25:28
 * @LastEditTime: 2020-06-02 09:16:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \element-test\js\data\dm_metaword.js
 */

let tipData = [
	{
		id: 1,
		name: "自忙时上行PRB平均利用率",
		abbr: "自忙时上行PRB平均利用率",
		type: null,
		desc:
			"选取小区满足集团繁忙标准的天，计算这些天中最忙小时上行PRB利用率的平均值。（参见术语<metaword></metaword>）",
	},
	{
		id: 2,
		name: "RB、PRB和VRB",
		abbr: "RB、PRB和VRB",
		type: null,
		desc:
			"<p>RB（RESOURCEBLOCK）有两个概念：VRB（VIRTUAL&nbsp;RESOURCEBLOCK）和PRB（PHYSICAL&nbsp;RESOURCEBLOCK）。VRB是虚拟的RB，mac层在分配资源的时候，是按VRB来分配的，然后VRB再映射到PRB。VRB映射到PRB也有两种映射方式：分布式和集中式。集中式VRB和PRB是一一对应的关系，分布式的VRB映射到PRB需要先交织，然后再按照一定的规则映射到实际的PRB位置。</p><p></p><p>RB是UE和UTRAN之间的连接格式集，就是UU口L1、L2的格式问题，即物理信道、传输信道、逻辑信道的配置问题。如果没有业务，RB是不需要的，因此如果要在CN/URTRN和UE之间传信令，只要有RRC连接即可（实际上也有无线承载，即SRB），但只要有业务，就必须配置RB，同样，必须配置Iub承载（只要有DCH就必须去配置DCH FP的承载，同RL一样）。</p><p>至于SRB，其实就是RB，也是RLC提供的服务，只不过他们用来承载控制面的控制消息，为了区别于RB而称为SRB。RB是RNC和UE的无线链路承载（Radio Bear），先RNC与NodeB之间的透明直传（direct transfer），再NodeB和UE之间传输。</p><p></p>",
	},
	{
		id: 3,
		name: "逻辑站规划编号",
		abbr: "逻辑站规划编号",
		type: null,
		desc: `选取小区满足集团繁忙标准的天，计算这些天中最忙小时上行PRB利用率的平均值。（参见术语<metaword>RB、PRB和VRB</metaword><metaword>自忙时上行PRB平均利用率</metaword>）`,
	},
	{
		id: 4,
		name: "市/地区/州/盟",
		abbr: "市/地区/州/盟",
		type: null,
		desc: `选取小区满足集团繁忙标准的天，计算这些天中最忙小时上行PRB利用率的平均值。（参见术语<metaword>RB、PRB和VRB</metaword><metaword>自忙时上行PRB平均利用率</metaword>）`,
	},
];

export default tipData;
