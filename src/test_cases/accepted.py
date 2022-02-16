# successful code for two-sum problem, accepted

# slug = "two-sum"

class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        table = {};
        
        for i in range(len(nums)):
            
            #print(table);
            #print(target - nums[i]);
            
            if nums[i] in table:
                return [table[nums[i]], i];
            else:
                table[target-nums[i]] = i;
        
