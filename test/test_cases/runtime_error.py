# runtime error
# slug = "median-of-two-sorted-arrays"

class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        l1 = len(nums1);
        l2 = len(nums2);
        
        partition_size = (l1+l2+1)//2;
        
        smallest = nums1;
        largest = nums2;
        l_smallest = l1;
        l_largest = l2;
        if l1 > l2:
            smallest = nums2;
            largest = nums1;
            l_smallest = l2;
            l_largest = l1;
        
        left = 0;
        right = l_smallest;
        
        while (left <= right):
            i = (left+right)//2;
            j = partition_size - i;
            
            if i < l_smallest and largest[j-1] > smallest[i]:
                left += 1;
                
            elif i > 0 and smallest[i-1] > largest[j]:
                right -= 1;
            
            else:
                maxLeft = -1;
                minRight = - 1;
                
                if i == 0: 
                    maxLeft = largest[j-1];
                elif j == 0:
                    maxLeft = smallest[i-1];
                else: 
                    maxLeft = max(smallest[i-1], largest[j-1]);
                
                if (l1 + l2)%2 == 1:
                    return maxLeft;
                
                if i == l_smallest: 
                    minRight = largest[j];
                elif j == l_largest: 
                    minRight = smallest[i];
                else:
                    minRight = min(smallest[i], largest[j]);
                    
                return (maxLeft+maxRight)//2;
           
                