import { IonList, IonItem, IonThumbnail, IonLabel, IonText, IonButton, IonIcon, IonBadge } from '@ionic/react';
import { cartOutline } from 'ionicons/icons';

const products = [
  { name: "Bamboo Watch", price: 65, category: "Accessories", rating: 5, stock: "INSTOCK", image: "bamboo-watch.jpg" },
  { name: "Black Watch", price: 72, category: "Accessories", rating: 4, stock: "INSTOCK", image: "black-watch.jpg" },
  { name: "Blue Band", price: 79, category: "Fitness", rating: 3, stock: "LOWSTOCK", image: "blue-band.jpg" },
  { name: "Blue T-Shirt", price: 29, category: "Clothing", rating: 5, stock: "INSTOCK", image: "blue-tshirt.jpg" },
  { name: "Bracelet", price: 15, category: "Accessories", rating: 4, stock: "INSTOCK", image: "bracelet.jpg" }
];

const ProductList: React.FC = () => {
  return (
    <IonList>
      {products.map((product, index) => (
        <IonItem key={index}>
          <IonThumbnail slot="start">
            <img src={`/assets/${product.image}`} alt={product.name} />
          </IonThumbnail>

          <IonLabel>
            <h2>{product.name}</h2>
            <IonText>
              <p>
                <IonIcon name="pricetag-outline" /> {product.category}
              </p>
            </IonText>

            {/* Rating (★ Star icons) */}
            <p>
              {Array.from({ length: 5 }, (_, i) => (
                <IonIcon key={i} name={i < product.rating ? "star" : "star-outline"} color="warning" />
              ))}
            </p>

            {/* Stock Badge */}
            <IonBadge color={product.stock === "INSTOCK" ? "success" : "warning"}>
              {product.stock}
            </IonBadge>
          </IonLabel>

          {/* Price & Cart Button */}
          <IonText slot="end">
            <h2>${product.price}</h2>
          </IonText>

          <IonButton fill="clear" slot="end">
            <IonIcon icon={cartOutline} />
          </IonButton>
        </IonItem>
      ))}
    </IonList>
  );
};

export default ProductList;
