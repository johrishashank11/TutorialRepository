package com.altruist.service;

import java.util.List;

import com.altruist.hibernate.mapping.IUser;

public interface LoginService 
{
	List<IUser> findLogin();
}
