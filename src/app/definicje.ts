export interface Wiersze 
   {
      data: string;
      name: string;
      kolor: string;
      tekst: string;
      klasa: string;
      kolor2: string;
      tekst2: string;
      klasa2: string;
   }

export interface Osoby
   {
      id: number;
      imie: string;
      nazwisko: string;
      funkcja: string;
      zalogowany: boolean;
      blokada: boolean;
      osoby: boolean;
  }

  export interface Sprawdz
  {
      stanSQL: boolean;
      stanAkcji: boolean;
      stanRejestracja: boolean;
      stanCzasStartuDedal: boolean;
      stanCzasDedala: boolean;
      stanPolecenia: boolean;
      stanDzialania: boolean;
  }

  export interface Polecenia
  {
      nazwa: string;
      czas: number;
      dzialanie: string;
      autoryzacja: boolean;
      polecenie: boolean;
      komunikat: string;
      nastepnyTrue: string;
      nastepnyFalse: string;
  }

  export interface Zalogowany
  {
      zalogowany: number;
      imie: string;
      nazwisko: string;
      autoryzacja: boolean;
      funkcja: string;
      rodzaj: string;
      kolor: string;
  }

  export interface Modul
  {
    id: number;  
    nazwa :string;
    symbol: string;
    producent: string;
    autoryzacja: boolean;
    polecenie: boolean;
    opis: string;
    czas: number;
  }