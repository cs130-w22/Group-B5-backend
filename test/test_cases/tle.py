# time limit exceeded

# slug = find-substring-with-given-hash-value

class Solution:
    def subStrHash(self, s: str, power: int, modulo: int, k: int, hashValue: int) -> str:
        n = len(s)       
        
        curr = 0
        for i in range(k):
            curr = ((ord(s[n-i-1]) - ord('a') + 1) + (power%modulo)*curr) % modulo
            
        ret = None
        
        for i in range(n-1, k-1, -1):
            if curr == hashValue:
                ret = i+1
            
            temp = self.helper(power, modulo, k)
            curr = (curr - ((ord(s[i])-ord('a')+1)*temp))%modulo
            curr = (curr*(power%modulo)) % modulo
            curr = (curr + (ord(s[i-k]) - ord('a') + 1)) % modulo
            
        
        if curr == hashValue:
            ret = k
        
        return s[ret-k:ret]
    
    def helper(self, power, modulo, k):
        curr = 1
        for i in range(k-1):
            curr = (curr*(power%modulo))%modulo
        
        return curr