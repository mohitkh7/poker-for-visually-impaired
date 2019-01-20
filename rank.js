// rank.js
module.exports = {
  getWinner: function(pack){
    return getWinner(pack);
  },
};
function getNumber(card){
    card = card.replace("A","14");
    card = card.replace("J","11");
    card = card.replace("Q","12");
    card = card.replace("K","13");
    return Number(card.substring(0,card.length-1));
}

function getSymbol(card){
    return card[card.length - 1];
}

function getNthHighCard(cards,n){
    var count = [0,0,0];
    for(var i=0;i<2;i++){
        for(var j=i+1;j<3;j++){
            if(getNumber(cards[i]) > getNumber(cards[j]))
                count[i]++;
            else
                count[j]++;
        }
    }
    var index = count.indexOf(3 - n);
    return getNumber(cards[index]);
        
    
}
function checkTriplet(cards){
    if((getNumber(cards[0]) == getNumber(cards[1])) && (getNumber(cards[1]) == getNumber(cards[2])))
            return true;
    return false;
}

function checkSequence(cards){
    var first = getNumber(cards[0]);
    var second = getNumber(cards[1]);
    var third = getNumber(cards[2]);
    if((Math.abs(first - second) == 1) && (Math.abs(second - third) == 1) && (first!=third))
        return true;
    if((Math.abs(second - first) == 1) && (Math.abs(first - third) == 1) && (second!=third))
        return true;
    if((Math.abs(first - third) == 1) && (Math.abs(third - second) == 1) && (first!=second))
        return true;
    
    return false;    
}

function checkColour(cards){
    if((getSymbol(cards[0]) == getSymbol(cards[1])) &&(getSymbol(cards[1]) == getSymbol(cards[2])))
        return true;
    return false;
}

function checkPair(cards){
    var first = getNumber(cards[0]);
    var second = getNumber(cards[1]);
    var third = getNumber(cards[2]);
    if(first == second)   
        return true;
    if(first == third)   
        return true;
    if(third == second)   
        return true;
    return false;
    
}

function getCount(ranks,num){
    var count = 0;
    for(var i=0;i<ranks.length;i++){
        if(ranks[i] == num)
            count++;
    }
    return count;
}

function getSum(cards){
      return getNumber(cards[0])+getNumber(cards[1])+getNumber(cards[2]);
}

function getMaxSumIndex(pack,maxRank,ranks){
    var maxSum = 0;
    var currSum = 0;
    var maxIndex = 0;
    for(var i=0;i<ranks.length;i++){
        if(ranks[i] == maxRank){
            currSum = getSum(pack[i]);
            if(currSum > maxSum){
                maxSum = currSum;
                maxIndex = i;
            }
        }
    }
    return maxIndex;
}

function getHighValue(pack,maxRank,ranks){
    console.log('High value');
    console.log('max rank : '+maxRank);
    var bigIndex = -1;
    for(var i=0;i<ranks.length;i++){
        if(ranks[i] == maxRank){
            if(bigIndex == -1)
                bigIndex = i;
            else{
                for(var j=1;j<=3;j++){
                    if(getNthHighCard(pack[i],j) > getNthHighCard(pack[bigIndex],j))
                        bigIndex = i;      
                    else if(getNthHighCard(pack[i],j) < getNthHighCard(pack[bigIndex],j))
                        break;      
                    
                }
            }
        }
    }
    return bigIndex;

}
function getWinner(pack){
    winner_index = 0
    var ranks = [];
    for(var i=0;i<pack.length;i++){
            if(checkTriplet(pack[i]))
                ranks.push(1);
            else if(checkSequence(pack[i]) && checkColour(pack[i]))
                ranks.push(2);
            else if(checkSequence(pack[i]))
                ranks.push(3);
            else if(checkColour(pack[i]))
                ranks.push(4);
            else if(checkPair(pack[i]))
                ranks.push(5);
            else
                ranks.push(6);
    }
    var maxRank = Math.min.apply(null,ranks);
    var count = getCount(ranks,maxRank);
    if(count == 1){
        winner_index = ranks.indexOf(maxRank);
    }else{
        if(maxRank == 5)
            winner_index = getHighValue(pack,maxRank,ranks);
        else
            winner_index = getMaxSumIndex(pack,maxRank,ranks)
    }
    
    return winner_index;    
}