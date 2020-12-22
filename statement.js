const plays = {
    "hamlet":{"name":"Hamlet", "type":"tragedy"},
    "as-like":{"name":"As You Like It", "type":"comedy"},
    "othello":{"name":"Othello", "type":"tragedy"}
}

const invoices = {
    "customer": "BigCo",
    "performances":[
        {
            "playID": "hamlet",
            "audience": 55
        },
        {
            "playID": "as-like",
            "audience": 35
        },
        {
            "playID": "othello",
            "audience": 40
        },
    ]
}

function statement(invoice, plays){

    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `청구 내역 (고객명: ${invoice.customer})\n`;
    const format = new Intl.NumberFormat("en-US", 
                        { style: "currency"
                            , currency:"USB"
                            , minimumFractionDigits: 2}
                        ).format;
    
    for ( let perf of invoice.performances ){
        let thisAmount = amountFor(perf, playFor(perf));   // 변수 인라인하기 const play = playFor(perf)
        // 포인트를 정립한다.
        volumeCredits += Math.max(perf.audience - 30, 0);

        // 희극 관객 5명마다 추가 포인트를 제공한다.
        if ("comedy" === playFor(perf).type ) volumeCredits += Math.floor(perf.audience/5); // 변수 인라인하기 play.type -> playFor(perf).type

        // 청구 내역을 출력한다.
        result += ` ${playFor(perf).name}: ${format(thisAmount/100)} (${perf.audience}석)\n`;  // 변수 인라인하기 play.name -> playFor(perf).name
        totalAmount += thisAmount;
    }

    result += `총액 : ${format(totalAmount/100)}\n`;
    result += `적립 포인트 : ${volumeCredits}점\n`;
    return result;
}

function playFor(aPerformance){
    return plays[aPerformance.playID];
}

function amountFor(aPerformance, play){  // perf 를 aPerformance 로 변경하여 보다 명확하게 변경
    let result = 0;

    switch(playFor(aPerformance).type){                  // play 는 playFor(perf). 즉, playFor(aPerformance) 한 값으로 play.type = playFor(aPerformance).type 이다
        case "tragedy": //비극
            result = 40000;
            if (aPerformance.audience > 30){
                result += 1000 * (aPerformance.audience - 30);
            }
            break;
        case "comedy": //희극
            result = 30000;
            if (aPerformance.audience > 20){
                result += 10000  + 500 * (aPerformance.audience - 20);
            }
            result += 300 * aPerformance.audience;
            break;
        default:
            throw new Error(`알 수 없는 장르 : ${playFor(aPerformance).type}`)  // play -> playFor(aPerformance)
    }
    return result;
}

console.log(statement(invoices, plays));
