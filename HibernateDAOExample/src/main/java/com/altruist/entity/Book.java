package com.altruist.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;


/********************************************************************************
This is the presistent class which contains the variables names of the database
tables. Persistent class is the class which is used to store and retrieve data 
from the table.
@Entity annotation is used to tell that this persistent class points to the 
table.
@Table annotation is used to tell the name of the table at which the class is
pointing.
@Column annotation is used to tell which variable is pointing to which column
in the table.
********************************************************************************/
@Table(name="book")
@Entity
public class Book 
{
	@Id
	@Column(name="id")
	private String id;
	
	@Column(name="title")
	private String title;
	
	@Column(name="author")
	private String author;
	
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getAuthor() {
		return author;
	}

	public void setAuthor(String author) {
		this.author = author;
	}

	
}
