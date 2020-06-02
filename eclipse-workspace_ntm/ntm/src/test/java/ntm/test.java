package ntm;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

public class test {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		
		
		subDirList("C:\\Users\\kimtaehan\\AndroidStudioProjects\\master\\app\\src");
//		C:\Users\kimtaehan\AndroidStudioProjects\master\app\src\hiup\java\kr\co\hi\hiup\service
		
	}
	static int cnt = 1;
	public static void subDirList(String source){

		File dir = new File(source); 

		File[] fileList = dir.listFiles(); 
		String tempSource  = source.replaceAll("C://", "");

		try{
			
			for(int i = 0 ; i < fileList.length ; i++){

				File file = fileList[i]; 

				if(file.isFile()){
					
					if(file.getName().split("\\.").length == 2) {
						String ext = file.getName().split("\\.")[1];
						
						if("kt".equals(ext)) {

							BufferedReader inFile = new BufferedReader(new FileReader(file));
							String sLine = null;
							int lineCount = 0;
							while ((sLine = inFile.readLine()) != null) {
								lineCount++;
								if(sLine.indexOf("@desc") != -1 || sLine.indexOf("@ desc") != -1) {
									System.out.print( "\t" +  tempSource);
									System.out.print( "\t" +  file.getName());
									System.out.print( "\t" +  sLine.split("desc")[1]);
								} 
							}

							System.out.println( "\t" + lineCount);
							
							
							
							 
//								System.out.println(); // 읽어들인 문자열을 출력 합니다.

					
						}
						
					}
					
				}else if(file.isDirectory()){
//					System.out.println("디렉토리 이름 = " + source + "\\" + file.getName());
					subDirList(file.getCanonicalPath().toString());  
				}

			}

		}catch(IOException e){

			

		}

	}




}
