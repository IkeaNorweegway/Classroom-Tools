# Payday's words, from v1 (public/materials/cefl/town/missions/7-income-tax.js): the "future you" situations, the nine bosses,
# the questions townspeople ask (facts and misconception-based wrong choices as v1), "What would help?", Sam's puns.
# Reading level: short sentences, everyday words, curriculum terms kept. No nodes.
extends RefCounted

const M = preload("res://games/payday/model.gd")
const Money = preload("res://engine/core/money.gd")

const SIT := {
	"avery": {"label": "17, living at home", "family": "mom"},
	"dev": {"label": "19, sharing an apartment", "family": "dev"},
	"rosa": {"label": "24, paying off a student loan", "family": "rosa"},
}

const FUTURE := {
	"avery": ["You’re 17. You live with your mom and go to high school.", "Your old laptop just died. Right before a big project! You need a new one."],
	"dev": ["You’re 19. You share an apartment with your buddy Dev.", "Dev snores. Loud. You want your own place someday."],
	"rosa": ["You’re 24. You share a house with Rosa. You’re also paying back a student loan.", "Last year your car broke down, and you had no money saved. Never again."],
}

## Each boss has a voice: hi (first shift), pay (payday), app (when Pay-O-Matic arrives), idle (small talk).
## b: the building (its room); outfit: what you wear for the job (and the boss wears too).
const WORK := {
	"grocer": {"b": "grocer", "boss": "Mr. Huang", "outfit": "apron", "outfit_label": "green apron", "look": {"skin": 2, "hair": "#231a14", "hair_style": 0, "shirt": "#4caf7a", "pants": "#3b3f5c", "outfit": "apron", "apron": "#2f6b3f"},
		"hi": "Welcome to Valley Market! Stack the apples nicely. People notice.", "pay": "Payday! Nice work this week.", "app": "We use a new app for pay now. Pay-O-Matic 3000. I am... not a computer person.", "idle": "The bananas came in green again. Patience."},
	"busser": {"b": "diner", "boss": "Ms. Pereira", "outfit": "apron", "outfit_label": "diner apron", "look": {"skin": 3, "hair": "#5a3a22", "hair_style": 1, "shirt": "#e2574c", "pants": "#2f2f38", "outfit": "apron", "apron": "#2f2f38"},
		"hi": "Welcome to the Lantern! Grab a tray. Table six needs you.", "pay": "Payday! You earned it. Table six left a mess.", "app": "Head office says we use Pay-O-Matic 3000 now. Fancy, right?", "idle": "Try the pie. Everyone says it’s the best in town."},
	"sports": {"b": "sports", "boss": "Coach Tam", "outfit": "cap", "outfit_label": "team cap", "look": {"skin": 2, "hair": "#231a14", "hair_style": 0, "shirt": "#e2574c", "pants": "#2f3a5c", "outfit": "cap", "cap": "#2f3a5c"},
		"hi": "Welcome to the team! Big smile. Know your shoes.", "pay": "Payday! Great hustle out there.", "app": "Huddle up. Payroll is on Pay-O-Matic 3000 now. New playbook!", "idle": "Hydrate! That goes for everyone."},
	"warehouse": {"b": "warehouse", "boss": "Mr. Kowalski", "outfit": "hivis", "outfit_label": "safety vest", "look": {"skin": 0, "hair": "#8a8580", "hair_style": 4, "shirt": "#8a9096", "pants": "#3b3f5c", "outfit": "hivis"},
		"hi": "Vest on. Lift with your legs. We ship by four.", "pay": "Payday. Good work. Don’t spend it all on snacks.", "app": "Head office bought Pay-O-Matic 3000. I don’t trust it. Check your stub.", "idle": "Forty boxes an hour. That’s the goal."},
	"bikeshop": {"b": "bikeshop", "boss": "Bea", "outfit": "cap", "outfit_label": "shop cap", "look": {"skin": 0, "hair": "#d9b46a", "hair_style": 1, "shirt": "#3f8fd2", "pants": "#3b3f5c", "outfit": "cap", "cap": "#3f7f9a"},
		"hi": "Welcome to Spoke & Chain! Do you know a derailleur from a doorknob? You will.", "pay": "Payday! Ride safe.", "app": "We switched to Pay-O-Matic 3000. It has more settings than my bike.", "idle": "A clean chain is a happy chain."},
	"phones": {"b": "phones", "boss": "Mr. Singh", "outfit": "vest", "outfit_label": "CellPoint vest", "look": {"skin": 3, "hair": "#231a14", "hair_style": 0, "shirt": "#2e9a9a", "pants": "#2f2f38", "outfit": "vest", "vest": "#1f5f6b"},
		"hi": "Welcome to CellPoint! Smile. Every customer is a sale waiting to happen.", "pay": "Payday! Great numbers this week.", "app": "Great news! Pay-O-Matic 3000! Fully automatic! What could go wrong?", "idle": "Have you seen the new phone? It folds. Twice."},
	"office": {"b": "clinic", "boss": "Ms. Ahmed", "outfit": "suit", "outfit_label": "blazer", "look": {"skin": 3, "hair": "#231a14", "hair_style": 2, "shirt": "#8a63c8", "pants": "#2f2f38", "outfit": "suit", "tie": "#8a63c8"},
		"hi": "Welcome to Riverbend Clinic. Here is your desk. And your very full calendar.", "pay": "Your pay is ready. Thank you for keeping us organized.", "app": "The clinic moved payroll to Pay-O-Matic 3000. Please review your stub carefully.", "idle": "If it isn’t in the calendar, it didn’t happen."},
	"apprentice": {"b": "electric", "boss": "Joe", "outfit": "hardhat", "outfit_label": "hard hat", "look": {"skin": 5, "hair": "#231a14", "hair_style": 0, "shirt": "#f2a93b", "pants": "#3b3f5c", "outfit": "hardhat"},
		"hi": "Welcome aboard! Rule one: hard hat on. Rule two: see rule one.", "pay": "Payday! Safe work, good work.", "app": "Office switched pay to some app. Pay-O-Matic 3000. I just do wires, kid.", "idle": "Measure twice, cut once."},
	"furniture": {"b": "furniture", "boss": "Mrs. Novak", "outfit": "vest", "outfit_label": "name-tag vest", "look": {"skin": 0, "hair": "#d8d4cc", "hair_style": 2, "shirt": "#8a63c8", "pants": "#3b3f5c", "outfit": "vest", "vest": "#6e5038", "glasses": true},
		"hi": "Welcome, dear! Help people find the comfiest couch in town.", "pay": "Payday, dear! Treat yourself to something small.", "app": "My nephew set up Pay-O-Matic 3000 for us. He says it’s very clever.", "idle": "Sit on that recliner. Isn’t it lovely?"},
}

const MILO_LOOK := {"skin": 0, "hair": "#d9b46a", "hair_style": 3, "shirt": "#e8c23a", "pants": "#2f3a5c"}   # Mrs. Novak's nephew, who made Pay-O-Matic
const MOM_LOOK := {"skin": 2, "hair": "#5a3a22", "hair_style": 1, "shirt": "#8a63c8", "pants": "#3b3f5c"}

const PUNS := ["Why did the penny go to school? To make some cents. ...Sorry.", "I’d tell you a joke about interest. But you wouldn’t be interested.",
	"Money talks. Mine just says goodbye.", "I’m saving my best jokes. Compound interest, you know.", "What do you call a sad dollar? A bummed buck. I’ll stop.",
	"I counted to a million once. Took forever. That’s why I work at a bank.", "This bank has great security. Even our jokes are locked up."]

## "What would help?", asked at home by your family or roommate.
const ASKS := {
	"bounce": {"text": "Ouch. A payment bounced last time. What’s your plan this time?", "opts": [
		["Put less in the jar. Plan with my take-home pay, not my gross pay.", 1, "Good plan. Plan with what lands in the bank, and keep a little extra just in case."],
		["Put more in the jar, so the jar can pay my bills.", 0, "The jar is locked until goal day. More in the jar means less for bills."],
		["Do the same thing again.", 0, "Same plan, same pay... same bounce."]]},
	"slow": {"text": "Your jar is falling behind. But you had money left over after bills. What would help?", "opts": [
		["Put more in the jar. Money left after bills can go to my goal.", 1, "Yes! Take-home pay minus bills. Most of what’s left can go in the jar."],
		["Put less in the jar.", 0, "Then the jar falls even further behind."],
		["Do the same thing again.", 0, "Same plan means the jar stays behind."]]},
}


static func pay_text(j: Dictionary) -> String:
	if j.type == "salary":
		return Money.fmt_w(j.yearly) + " a year (salary)"
	var s := Money.fmt(j.rate) + " an hour" + (" (student rate)" if j.has("rate18") else "")
	if j.type == "commission":
		s += " + %d%% of sales" % roundi(float(j.pct) * 100)
	if j.type == "tips":
		s += " + cash tips"
	return s


## The job board's question for a posting, its answer, and how to work it out.
static func offer_q(j: Dictionary) -> Dictionary:
	var h := int(j.hours[0])
	if j.type == "salary":
		return {"text": "Gross pay every two weeks (26 pays a year)", "ans": M.jr(float(j.yearly) / 26.0), "how": "Yearly salary ÷ 26."}
	if j.type == "commission":
		return {"text": "Gross pay for %d hours with %s in sales" % [h, Money.fmt_w(j.sales[0])], "ans": h * int(j.rate) + M.jr(float(j.sales[0]) * float(j.pct)),
			"how": "%d × %s + %d%% of %s." % [h, Money.fmt(j.rate), roundi(float(j.pct) * 100), Money.fmt_w(j.sales[0])]}
	if j.type == "tips":
		return {"text": "Pay from the diner for %d hours (tips not counted)" % h, "ans": h * int(j.rate), "how": "%d hours × %s." % [h, Money.fmt(j.rate)]}
	return {"text": "Gross pay for %d hours" % h, "ans": h * int(j.rate), "how": "%d hours × %s." % [h, Money.fmt(j.rate)]}


## The questions, asked by townspeople in their own words. pd: the mission state.
static func q(id: String, pd: Dictionary) -> Dictionary:
	var run: Dictionary = pd.get("run", {})
	var j: Dictionary = M.JOBS.get(str(run.get("job", "")), {})
	var x := M.extra_hours(str(run.get("worker", "avery")))
	match id:
		"paytype":
			var opts := {
				"wage": [["My pay goes up and down with my hours. Fewer hours means a smaller paycheque.", 1, "Yes! Hours times your wage. Every hour counts."], ["I get the same pay every two weeks, even if I work less.", 0, "That’s a salary. With a wage, every hour counts."], ["Hourly jobs always pay more than salary jobs.", 0, "Not always. It depends on the rate and the hours."]],
				"salary": [["I get the same pay every two weeks, even if I stay late.", 1, "Yes! Your salary is split into 26 equal pays."], ["If I stay late, I get paid more.", 0, "Not with a salary. Your pay is set for the whole year."], ["Nothing comes off a salary.", 0, "Oh, things come off. You’ll see on payday."]],
				"commission": [["Part of my pay depends on my sales. A slow month means less money.", 1, "Yes! Sell more, earn more. Sell less, earn less."], ["Commission always pays more than an hourly job.", 0, "Only when sales are good."], ["My commission is the same every payday.", 0, "Nope. It goes up and down with your sales."]],
				"tips": [["Tips change every shift, so I can’t count on them.", 1, "Yes! Plan with your wage. Tips are a bonus."], ["I get the same tips every night.", 0, "Some nights are busy. Some nights are dead."], ["My boss decides my tips.", 0, "Customers decide your tips, not your boss."]]}
			return {"label": "Pay type: what is true", "text": "Okay, quick check before you start. What’s true about how this job pays?", "opts": opts[j.type]}
		"whyLess":
			return {"label": "Why less than the job promised", "text": "So the job said you’d earn more than this. Where did the rest go?", "opts": [
				["Some came off first, for things like EI, CPP and income tax.", 1, "Bingo! Those are deductions. What’s left is your take-home pay. We call it net pay."],
				["My boss kept some of it for the store.", 0, "Nope. Look at the stub. Every missing dollar has a name."],
				["The bank took a fee to put it in my account.", 0, "Hey! We would never. Well, not for that. The money was gone before it got here."]]}
		"extra":
			if j.type == "salary":
				return {"label": "Extra hours on a salary", "text": "If you work those %d extra hours, what happens to your pay?" % x, "opts": [
					["Nothing. A salary stays the same, no matter how many hours.", 1, "Yep. Salary is salary. So it’s up to you."],
					["I get paid for every extra hour.", 0, "Not on a salary. The pay is set for the year."],
					["My pay goes down, because more hours means more tax.", 0, "Tax depends on your pay, not your hours. Your pay stays the same."]]}
			return {"label": "Extra hours: more or less take-home?", "text": "If you take the %d extra hours, what happens to your take-home pay?" % x, "opts": [
				["It goes up. A little more tax comes off, but I keep most of it.", 1, "That’s right. More work, more money in your pocket."],
				["It goes down. More pay means more tax, so I lose money.", 0, "Lots of people think that! But tax only takes part of each extra dollar."],
				["It stays the same. Tax takes all the extra pay.", 0, "Tax takes a bite, not the whole thing."]]}
		"newline":
			return {"label": "Turning 18: what changes", "text": "Something changes on your next pay stub now that you’re 18. Do you know what?", "opts": [
				["CPP starts coming off. And my wage goes up to $15, because the student wage is only for under 18.", 1, "Look at you! Happy birthday, money expert."],
				["Income tax starts, because I’m an adult now.", 0, "Not yet. Income tax is about how much you earn, not your age."],
				["Nothing changes until I finish school.", 0, "Two things change: your wage, and CPP."]]}
		"card-ei":
			return {"label": "Who EI helps", "text": "Money still comes in every two weeks while I look for work. Where do you think it comes from?", "opts": [
				["From EI. A little came off every paycheque you got. Now it pays you back.", 1, "Yep. I used to hate that line on my stub. Not anymore."],
				["From CPP. CPP is for people who lose their job.", 0, "Nope, CPP is for when you retire. Ask your grandpa!"],
				["From income tax. They send it to anyone who asks.", 0, "Not tax, and not for anyone. You get EI because you worked and paid into it."]]}
		"card-cpp":
			return {"label": "Who CPP helps", "text": "Now a cheque comes for me every month. Can you guess where it comes from?", "opts": [
				["From CPP. You paid into it from every paycheque while you worked.", 1, "Smart kid! You pay into it now too. Someday it comes back to you."],
				["From EI, because you stopped working.", 0, "Ha! EI is for people looking for a new job. I’m only looking for my glasses."],
				["From your bank. It’s a gift for retiring.", 0, "I wish! No, I paid for this one myself."]]}
		"card-tax":
			return {"label": "What income tax pays for", "text": "Nobody paid us at the door today. So who pays for all this?", "opts": [
				["Everyone does. Income tax and other taxes pay for hospitals.", 1, "Exactly. About 41% of what Alberta spends goes to health care (2026)."],
				["EI pays for hospital visits.", 0, "EI is for people who lost a job. Not for broken wrists."],
				["CPP pays for hospital visits.", 0, "CPP is for retirement. Hospitals run on taxes."]]}
		"taxfree":
			if str(run.worker) == "avery":
				return {"label": "Why $0 income tax", "text": "Look at your stubs. Income tax: $0.00. Every time! Why?", "opts": [
					["I don’t earn enough in a year. The first $16,452 (Canada) and $22,769 (Alberta) are not taxed.", 1, "Yes! About $8,000 a year is under both lines. Big brain play!"],
					["Students don’t pay income tax.", 0, "Students do pay, if they earn enough. School has nothing to do with it."],
					["People under 18 don’t pay income tax.", 0, "Age doesn’t matter. How much you earn in a year does."]]}
			var yr := M.jr(float(run.log[-1].stub.gross) * 26.0 / 10000.0) * 100
			return {"label": "Why tax is less than 22%", "text": "You earn about %s a year. The tax rates are 14%% and 8%%. That’s 22%%! So why is your tax so much smaller?" % Money.fmt_w(yr), "opts": [
				["Part of my pay is not taxed. Only money above $16,452 (Canada) and $22,769 (Alberta) gets taxed.", 1, "That’s it! That’s why the Pay Card starts at zero."],
				["Young workers get a lower tax rate.", 0, "Same rate at any age. The tax-free part makes the difference."],
				["Tax only comes off some paycheques.", 0, "It comes off every one. Just less than you’d think."]]}
	return {}
