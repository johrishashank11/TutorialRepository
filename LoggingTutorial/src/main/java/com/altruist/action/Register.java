package com.altruist.action;



import org.apache.log4j.Logger;

import com.altruist.dao.RegisterDao;

public class Register 
{
	private static  Logger logger = Logger.getLogger(Register.class);
	private int id;
	private String username;
	private String password;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	
	public String execute()
	{
		String result="";
		int i=RegisterDao.saveUser(this);
		System.out.println("System out line");
		logger.warn("Warning Message");
		logger.info("Information Message");
		logger.debug("Severe Message");
		if(i>0)
		{
			result="success";
		}
		else
		{
			result="fail";
		}
		
		return result;
	}
}
