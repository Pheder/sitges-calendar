import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
 name: 'search',
 pure: true
})

@Injectable()
export class SearchPipe implements PipeTransform {
 /**
   * @param items object from array
   * @param term term's search
   */
  transform(items: any, term: string): any {
    if (!term || !items) { return items; }

    return this.filter(items, term);
  }

  /**
   *
   * @param items List of items to filter
   * @param term  a string term to compare with every property of the list
   *
   */
  filter = (items: Array<{ [key: string]: any }>, term: string): Array<{ [key: string]: any }> => {

    const toCompare = term.toLowerCase();

    return items.filter(function (item: any) {
        if (item.value[0]['title'].toString().toLowerCase().includes(toCompare)) {
          return true;
        } else if ( item.value[0].isMarathon) {
          for (const film of item.value[0].films ) {
            if (film.title.toString().toLowerCase().includes(toCompare)) {
              return true;
            }
          }
        }
      return false;
    });
  }
}
