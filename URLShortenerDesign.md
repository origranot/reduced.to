# URL SYSTEM DESIGN

<BR>

<div align="center">
<img src="https://user-images.githubusercontent.com/94545831/194768600-28ee52d8-e510-4439-83fb-16729fcf3e07.png"></div>

<br>

- This is how a URL Shortener looks. Isn't it ? Hope you are curious to know that how it works in the background.


- Examples — goo.gl, bit.ly etc

  - Shortened URL should be random and unique. It should be a combination of characters (A-Z, a-z) and numbers (0–9).

## Important Features

1. Convert Long URL to Tiny URL

2. Convert Tiny URL into Long URL

<br>

## Concepts used 

Let’s understand 3 concepts which will be used later in the detailed design.

- <u> Zookeeper </u>: 
It’s a component that retains the count (similar to apache kafka) and assign random number ranges for each server.

- <u>Base 62 </u>:
Base 62 is an encoding scheme which uses 62 characters (a-z, A-Z) and numbers (0–9) is 26+26+10 = 62.

- <u>MD5 Hash </u>: 
It’s a cryptographic hash algorithm which is used to generate 128 bit digest when a string of any length is input using the complex maths formula. It converts data into blocks of specific sizes.

<br>

# Traffic

- Let's assume we want to serve more than 1000 billion URLs. If we can use 62 characters [A-Z, a-z, 0-9] for the short URLs having length n, then we can have ``` total 62^n URLs. ```

- So, we should ```keep our URLs as short ```as possible given that it should fulfill the requirement. 

- For our requirement, we should use n=7 i.e the length of short URLs will be 7 and we can serve 62^7 ~= 3500 billion URLs.

<br>

# Solution

One of the most simple but also effective one, is to have a database table set up this way :



Table Tiny_Url( <br>
ID : int PRIMARY_KEY AUTO_INC,<br>
Original_url : varchar,<br>
Short_url : varchar) <br> 


- Then the auto-incremental primary key ID is used to do the conversion: (ID, 10) <==> (short_url, BASE).

-  Whenever you insert a new original_url, the query can return the new inserted ID, and use it to derive the short_url, ```save this short_url and send it to client.```

<br>

# PseudoCode


<h2> Get shortened URL </h2>

- Hash original URL string to 2 digits as hashed value hash_val.

- Use hash_val to locate machine on the ring.

- Insert original URL into the database and use getShortURL function to get shortened URL short_url.

- Combine hash_val and short_url as our final_short_url (length=8) and return to the user.

<h2> Retrieve original from short URL</h2>

- Get first two chars in final_short_url as hash_val.

- Use hash_val to locate the machine.

- Find the row in the table by rest of 6 chars in final_short_url as short_url.

- Return original_url to the user.

<br><br>

<img src="https://user-images.githubusercontent.com/94545831/194769562-fd03e3ba-9e23-4e86-bc61-7a1c79089baa.png">
