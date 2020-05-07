package ntm;

public class test {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		
		
		String url = "/ntm/user/searchUserList.do";
		url = url.substring(url.lastIndexOf("/") + 1).replace(".do", "");
		
		System.out.println(url); 
		
//		Class<?> c = Class.forName("class name");
//		Method method = c.getDeclaredMethod("method name", parameterTypes);
//		method.invoke(objectToInvokeOn, params);
	}
	
	
	public void tempsearchUserList(String temp) {
		System.out.println("test");
		
		
	}

}
