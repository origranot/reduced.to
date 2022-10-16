#include<iostream>
#include<stdlib.h>
using namespace std;
void show_bin(unsigned int n);
void show_oct(unsigned int n);
void show_hex(unsigned int n);

int main(){
	unsigned int n;    
	cout<<"Enter the number to convert: ";    
	cin>>n;    
	show_bin(n);
	show_oct(n);
	show_hex(n);
	system("PAUSE");
	return 0;
}
void show_bin(unsigned int n)
{
	int a[32], i, no = n;    
	for( i = 0 ; no > 0 ; i++ ){    
		a[i] = no % 2;    
		no   = no / 2;  
	}    
	cout<< n << " = ("; 
	for( i-- ; i >= 0 ; i-- )    
		cout << a[i];
	cout<< ") in Base 2"<< endl;
}

void show_oct(unsigned int n)
{
	int a[32], i, no = n;    
	for( i = 0 ; no > 0 ; i++ ){    
		a[i] = no % 8;    
		no   = no / 8;  
	}    
	cout<< n << " = ("; 
	for( i-- ; i >= 0 ; i-- )    
		cout << a[i];
	cout<< ") in Base 8"<< endl;
}
void show_hex(unsigned int n)
{
	int a[32], i, no = n;    
	for( i = 0 ; no > 0 ; i++ ){    
		a[i] = no % 16;    
		no   = no / 16;  
	}    
	cout<< n << " = ("; 
	for( i-- ; i >= 0 ; i-- ) {
		switch(a[i]){
		case (10): cout << "A";break;
		case (11): cout << "B";break;
		case (12): cout << "C";break;
		case (13): cout << "D";break;
		case (14): cout << "E";break;
		case (15): cout << "F";break;
		default  : cout << a[i];
		}
	}
	cout<< ") in Base 16"<< endl;
}
