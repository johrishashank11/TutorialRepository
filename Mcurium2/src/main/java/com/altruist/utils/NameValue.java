package com.altruist.utils;


/**
 * Generic name value class
 * @param <T> is type of property value
 * @author Pavnesh
 */


public class NameValue<T>{
	
	/**Name of the property */
	private String name;
	/**Value of the property */
	private T value;
	
	/**
	 * Constructor to initialize NameValue using name and value
	 */
	NameValue(final String propertyName, final T propertyValue){
		this.name = propertyName;
		this.value = propertyValue;
	}

	/**
	 * Get the name of property
	 *@return property name 
	 */
	public final String getName(){
		return name;
	}
	
	/**
	 * @return value of propety
	 */
	
	public final T getValue(){
		return value;
	}

}
