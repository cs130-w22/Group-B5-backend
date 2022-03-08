# incorrect answer

# slug = "add-two-numbers"

class Solution:
    def addTwoNumbers(self, l1: ListNode, l2: ListNode) -> ListNode:
        carry = 0;
        currNode = ListNode();
        dummy = ListNode();
        dummy.next = currNode;
            
        while l1 and l2:
            currSum = l1.val + l2.val + carry;
            if currSum > 9:
                carry = 1;
                currSum -= 10;
            
            nextNode = ListNode(currSum);
            currNode.next = nextNode;
            currNode = currNode.next;
            l1 = l1.next;
            l2 = l2.next;
        
        while l1:
            currSum = l1.val + carry;
            if currSum > 9:
                carry = 1;
                currSum -= 10;
                
            nextNode = ListNode(currSum);
            currNode.next = nextNode;
            currNode = currNode.next;
            l1 = l1.next;
            
        while l2:
            currSum = l2.val + carry;
            if currSum > 9:
                carry = 1;
                currSum -= 10;
                
            nextNode = ListNode(currSum);
            currNode.next = nextNode;
            currNode = currNode.next;
            l2 = l2.next;
          
        
        return dummy.next.next;