# Ruggable Backend Technical

## Background
Ruggable rugs are made to order. This means that generally speaking we don't stock finished goods and instead we stock raw materials that can be turned into a variety of our products. Our main raw material is a roll of fabric that we print designs on. The length of the roll may vary from roll to roll. 

There are 3 different sizes of rugs that need to be printed, 2.5x7's (which are considered runners), 3x5's and 5x7's. Below is an example of the orientation of how the rugs would be laid out when printed. 
<img src='images/PrintedRugLayoutExample.png' />

This table shows how the different size rugs would be printed.
|Rug Size | Length (ft) | Width (ft) | Side by Side Printing |
| --- | --- | --- | --- |
| 2.5' x 7' | 7 | 2.5 | Yes |
| 3' x 5' | 3 | 5 | No |
| 5' x 7' | 7 | 5 | No |
## Problem
 An operator of a printer needs to know what they should be printing next. We try to maintain a first in, first out (FIFO) approach with the exception of items that need to be rushed. They will utlize a web app that calls your endpoint which will tell them the next highest priority items to print. 
## Requirements
### Endpoint
- Your endpoint should return a list of the next items that are to be printed. 
- These rugs should be in priority order and the position field should reflect this priority.
    - One exception to this is that runners are not always next to each other priority wise. You can pull a runner from later in the queue to fill an empty space 
- Only components with a status of `Pending` should be included
- Only orders that have `cancelled` set to false should be included.
- If the request parameter `include_rush` is selected, rush and non-rushed rugs can be returned in the query.
- If the request parameter `include_rush` is set to false, only non-rushed rugs should be returned in the query.
- The sum of the length of the rugs returned should be less than or equal to the length of the roll.
#### Priority
Components are broken into two "buckets." The first bucket is every component that has `rush=true` and the second bucket is all orders where `rush=false`. Within each bucket, the highest priority items are the oldest orders and the rushed orders have priority over non rushed rugs. Below is an example of the priority would work.
 | Component ID | Rush | Order Date |
 | --- | --- | --- |
 | 99 | True | 2020-12-01 | 
 | 125 | True | 2020-12-02 | 
 | 133 | True | 2020-12-03 | 
 | 27 | False | 2020-10-13 | 
 | 30 | False | 2020-11-22 |
 | 55 | False | 2020-11-29 | 
 | 128 | False | 2020-12-02|
    
#### Input
Your endpoint should accept the following inputs:
- `roll_length` (decimal) - The length of the roll being planned for in feet.
- `include_rush` (boolean) - if items that are marked as rush should be included in this plan or not

##### Sample Input
```
{
    "roll_length": 25.62,
    "include_rush": true
}
```

#### Output
The data should be returned as JSON.
Your endpoint should return the following:
- `roll_length` (in feet)
- An array of components on a roll titled `plan`. Each entity in the array should contain:
    - `id` (of the component)
    - `component_size`
    - `order_date`
    - `position` - The position should denote where in the plan a rug would be printed. If a runner (a 2.5x7 rug) is printed side by side, both rugs should have the same position. In the example image above, the 5x7 would be in position 1, both 2.5x7's would be in position 2 and the 3x5 would be in position 3.
    - `sku`
    - `rush`
##### Sample Output
```
{
    "roll_id": 2562,
    "length": 14.2
    "plan":[
        {
            "id": 5683,
            "position": 1,
            "size": "2.5x7",
            "order_date": "2020-10-13 04:27:30-07:00",
            "sku": "RS-1234-27",
            "rush": true
        },
        {
            "id": 2562,
            "position": 1,
            "size": "2.5x7",
            "order_date":"2020-09-14 16:24:24-07:00",
            "sku": "RC-1013-27",
            "rush": false
        },
        {
            "id": 9876,
            "position": 2
            "size": "3x5",
            "order_date":"2020-11-22 10:02:06-07:00",
            "sku": "RS-1234-27",
            "rush": true
        },
        {
            "id": 5684,
            "position": 3
            "size": "3x5",
            "order_date":"2020-11-22 10:30:24-07:00",
            "rush": true
        }
    ]
}
```
## Assumptions
- There is only one width of roll, 5 feet wide.
- A line item has a quantity of 1. If more than one of a particular design is ordered, it will appear as a separate line item

## Supplied Tables
- **`component`**: You can think of a component as a synonym for a rug. There will be one component per line item.
- **`line_item`**: A particular item that was ordered. There are potentially n line items for each order
- **`order`**: Contains information about the order. 

There is a `db.sql` file included that will set these tables up with some data that you should be able to use. 

## Other Considerations
- Feel free to add tables or columns to existing tables.
- Don't remove any of the existing tables, but if you feel there is a better way to handle a situation, make a note of it.
- Feel free using a modern popular language that you are comfortable with. We use Node at Ruggable but we are more interested in how you approach solving the problem over the specific language.
- Don't worry if you aren't able to fully finish everything in time. Focus mainly on the core logic.
- Please upload your code to Github and share the link with us. 
