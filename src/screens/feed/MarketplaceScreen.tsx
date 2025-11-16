import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BRAND_LOGOS = [
  { name: 'Reformation', logo: 'https://logo.clearbit.com/reformation.com', url: 'https://www.reformation.com' },
  { name: 'Girlfriend Collective', logo: 'https://logo.clearbit.com/girlfriend.com', url: 'https://www.girlfriend.com' },
  { name: 'Eileen Fisher', logo: 'https://logo.clearbit.com/eileenfisher.com', url: 'https://www.eileenfisher.com' },
  { name: 'Patagonia', logo: 'https://logo.clearbit.com/patagonia.com', url: 'https://www.patagonia.com' },
  { name: 'Veja', logo: 'https://logo.clearbit.com/veja-store.com', url: 'https://www.veja-store.com' },
  { name: 'Everlane', logo: 'https://logo.clearbit.com/everlane.com', url: 'https://www.everlane.com' },
  { name: 'PACT', logo: 'https://logo.clearbit.com/wearpact.com', url: 'https://wearpact.com' },
];

const TOP_PICKS = [
  {
    id: '1',
    brand: 'Reformation',
    name: 'Jillian Silk Dress',
    price: '$348',
    image: 'https://media.thereformation.com/image/upload/f_auto,q_auto:eco,dpr_2.0/w_500/PRD-SFCC/1318344/PEAR/1318344.1.PEAR',
    url: 'https://www.google.com/aclk?sa=L&ai=DChsSEwiEuuXP9_WQAxWrMtQBHRC4IgAYACICCAEQBRoCb2E&co=1&ase=2&gclid=Cj0KCQiA5uDIBhDAARIsAOxj0CEDokX3U6HMOal-u9MFWsSBnEFN98NHttbubhffzCTBPepnP__YXh0aArOzEALw_wcB&cid=CAASmAHkaLUO6eEBjPrBGFySI0i2tEl9BP2L7TAMcMCdRdT3zFctk4SmWCVsVZSQrThxQCXKlveMi6QdcxRl-3eJj9WfrtWK1tLl_5nbtwp7V4m-zg1mmDJu416X_r6Fvh3RQ1zKZpNuKlq1lsIxXq6rduP6L2kLQEuPkzox9OZBWX1M8yveD4LCkgopoyr16AeMJ4o8oNuq-rvdBg&cce=2&category=acrcp_v1_32&sig=AOD64_1FhSG4KtevNNzxYh5Kfq2qGEPoQQ&ctype=5&q=&nis=4&ved=2ahUKEwi5wd_P9_WQAxVZ4ckDHZdCEHcQ9aACKAB6BAgLEBE&adurl=',
    sustainability: {
      waterSaved: '2,500 gallons',
      co2Reduced: '10 lbs',
      recycledMaterials: '55% recycled fabric',
    },
  },
  {
    id: '2',
    brand: 'Girlfriend Collective',
    name: 'Compressive High-Rise Legging',
    price: '$108',
    image: 'https://girlfriend.com/cdn/shop/files/4007_4008_Legging_XS_SnowCap_1_web_2048x2048.jpg?v=1738799016',
    url: 'https://girlfriend.com/collections/compressive-high-rise-legging/products/snowcap-compressive-high-rise-legging',
    sustainability: {
      waterSaved: '1,100 gallons',
      co2Reduced: '7 lbs',
      recycledMaterials: '79% recycled plastic bottles',
    },
  },
  {
    id: '3',
    brand: 'Eileen Fisher',
    name: 'Organic Cotton Tee',
    price: '$78',
    image: 'https://www.eileenfisher.com/dw/image/v2/BGKB_PRD/on/demandware.static/-/Sites-ef-main-catalog/default/dw979c7c97/images/F5WXA-T5758M-103-ALT.jpg?sw=876&sh=1168&sfrm=png&q=90',
    url: 'https://www.eileenfisher.com/waffle-cotton-blend-doubleknit-funnel-neck-box-top/F5WXA-T5758.html?dwvar_F5WXA-T5758_color=103',
    sustainability: {
      waterSaved: '800 gallons',
      co2Reduced: '5 lbs',
      recycledMaterials: '100% organic cotton',
    },
  },
  {
    id: '4',
    brand: 'Patagonia',
    name: 'Better Sweater Jacket',
    price: '$139',
    image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcShdfC_mS9d9qUis80wXdkbQNF1aOo_GuucIkvOmrimAn7VHnE5iDHfRV_D6uahGvbHY1ujrVu26bOfCWqIxw6HsVMSZUDfIhPOxSLQz2kYXPRAlu9g-hQ9XU7jY5Y-lDY1797_5jsucQ&usqp=CAc',
    url: 'https://www.patagonia.com/product/womens-better-sweater-fleece-jacket/192964027725.html?s_kwcid=17928&utm_source=google&utm_medium=cpc&utm_campaign=BB_Ecomm_PMaxFO_ALL_SPW_CasualFleece&gad_source=1&gad_campaignid=18971279731&gbraid=0AAAAADmSsarod67Zg4YmUe8voqbvKbp9_&gclid=Cj0KCQiA5uDIBhDAARIsAOxj0CExnsqBS12b2PmM1rPHsAJVy60Zz-Htru-QiZ1xUozx5ky7HEl03b0aAk1MEALw_wcB',
    sustainability: {
      waterSaved: '1,500 gallons',
      co2Reduced: '9 lbs',
      recycledMaterials: '100% recycled polyester',
    },
  },
  {
    id: '5',
    brand: 'Veja',
    name: 'V-10 Sneakers',
    price: '$150',
    image: 'https://media.veja-store.com/images/t_sfcc-producttile-desktop-v3/f_auto/c_limit,w_750/v1761332649/VEJA/PACKSHOTS/CA0103129_2/veja-sneakers-campo-ca-organic-cotton-white-ca0103129_2.jpg',
    url: 'https://www.veja-store.com/en_us/p/campo-canvas-white-pierre-CA0103129.html?cgid=VEGAN',
    sustainability: {
      waterSaved: '950 gallons',
      co2Reduced: '6 lbs',
      recycledMaterials: '20% recycled plastic bottles',
    },
  },
  {
    id: '6',
    brand: 'Everlane',
    name: 'The Day Heel',
    price: '$165',
    image: 'https://www.everlane.com/cdn/shop/files/eb7c977e_bb90.jpg?v=1753411600&width=990https://www.everlane.com/cdn/shop/files/eb7c977e_bb90.jpg?v=1753411600&width=990',
    url: 'https://www.everlane.com/products/womens-leather-day-heel2-pale-pink?variant=42254364180566&country=us&utm_medium=cpc&utm_source=pla-google&utm_campaign=23143465595&utm_content=779360622396&utm_term=pla-362703747492&adgroup=189548254040&pid=14613-112894&device=c&gad_source=1&gad_campaignid=23143465595&gbraid=0AAAAADCXUrsmsAG0zBEMomQvH8oALG3cq&gclid=Cj0KCQiA5uDIBhDAARIsAOxj0CHLgZNQ2kAonAwPPuzTU1XrQmTSsQklgxVEzTxDKGTq2xhIx-juT1UaAgqaEALw_wcB',
    sustainability: {
      waterSaved: '700 gallons',
      co2Reduced: '4 lbs',
      recycledMaterials: 'Ethically sourced leather',
    },
  },
];

const MarketplaceScreen: React.FC = () => {
  const handleBrandPress = async (url: string) => {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Cannot Open Link', 'Unable to open this link.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open link.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shop Our Sustainable Brand Partners</Text>
        <Text style={styles.headerSubtitle}>
          Discover eco-friendly fashion from brands committed to sustainability
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.brandBannerContainer}
        contentContainerStyle={styles.brandBannerContent}
      >
        {BRAND_LOGOS.map((brand, index) => (
          <TouchableOpacity
            key={index}
            style={styles.brandCard}
            onPress={() => handleBrandPress(brand.url)}
          >
            <View style={styles.brandLogoContainer}>
              <Image
                source={{ uri: brand.logo }}
                style={styles.brandLogo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.brandName}>{brand.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Top Picks for You</Text>
        <View style={styles.productsGrid}>
          {TOP_PICKS.map((product) => (
            <TouchableOpacity
              key={product.id}
              style={styles.productCard}
              onPress={() => handleBrandPress(product.url)}
            >
              <Image source={{ uri: product.image }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.brandLabel}>{product.brand}</Text>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productPrice}>{product.price}</Text>
              </View>

              <View style={styles.buyNowButton}>
                <Text style={styles.buyNowText}>Buy Now</Text>
                <Ionicons name="arrow-forward" size={16} color="#fff" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#666',
    lineHeight: 20,
  },
  brandBannerContainer: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  brandBannerContent: {
    paddingHorizontal: 15,
    gap: 12,
  },
  brandCard: {
    alignItems: 'center',
    marginRight: 15,
  },
  brandLogoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  brandLogo: {
    width: 75,
    height: 75,
  },
  brandName: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    maxWidth: 80,
  },
  section: {
    padding: 15,
    backgroundColor: '#f9f9f9',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 15,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  productCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  productImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  productInfo: {
    padding: 12,
  },
  brandLabel: {
    fontSize: 12,
    color: '#34C759',
    fontWeight: '600',
    marginBottom: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 6,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  sustainabilityContainer: {
    backgroundColor: '#f0fff4',
    padding: 10,
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d4f4dd',
  },
  sustainabilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  sustainabilityTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#34C759',
    marginLeft: 4,
  },
  statsGrid: {
    gap: 4,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  statText: {
    fontSize: 10,
    color: '#333',
    marginLeft: 6,
  },
  buyNowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 12,
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 8,
    gap: 6,
  },
  buyNowText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default MarketplaceScreen;
