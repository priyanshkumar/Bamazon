create database bamazon;

use bamazon;

create table products(
	item_id int not null auto_increment,
    product_name varchar(100) not null,
    department_name varchar(100) not null,
    price float(6,2) not null,
    stock_quantity int(10) not null,
    primary key(item_id)
);

insert into products(product_name, department_name, price, stock_quantity) values("tomatoes", "vegetables", 2, 40),("Nivia Shower Gel for Men", "Men Cosmatics", 5.49, 25),
("Doritos","Chips",3.50, 55);

select * from products;