import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const LAST_UPDATED = 'April 8, 2026';

export default function PrivacyPolicyScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const router = useRouter();

    return (
        <View style={[styles.container, isDark && styles.containerDark]}>
            <Stack.Screen
                options={{
                    title: 'Privacy Policy',
                    headerStyle: { backgroundColor: isDark ? '#1E1E1E' : '#fff' },
                    headerTintColor: isDark ? '#fff' : '#333',
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Ionicons name="chevron-back" size={24} color={isDark ? '#fff' : '#333'} />
                        </TouchableOpacity>
                    ),
                }}
            />
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <Text style={[styles.title, isDark && styles.textDark]}>Privacy Policy</Text>
                <Text style={[styles.updated, isDark && styles.mutedDark]}>Last updated: {LAST_UPDATED}</Text>

                <Section title="Overview" isDark={isDark}>
                    Daily Impact ("the app") is a personal sustainability tool built by Lotte Boonstra. This policy explains what data the app collects, how it is used, and your rights.
                </Section>

                <Section title="Data We Collect" isDark={isDark}>
                    The app stores the following information <Text style={styles.bold}>locally on your device only</Text>:{'\n\n'}
                    • <Text style={styles.bold}>Profile information</Text> — your name, bio, and email address, which you enter voluntarily.{'\n'}
                    • <Text style={styles.bold}>Profile photo</Text> — an image you choose from your photo library.{'\n'}
                    • <Text style={styles.bold}>Daily action history</Text> — a record of the sustainable actions you have marked as completed.{'\n'}
                    • <Text style={styles.bold}>App preferences</Text> — notification settings and other in-app choices.
                </Section>

                <Section title="How Data Is Stored" isDark={isDark}>
                    All data is stored exclusively on your device using Apple's standard local storage (AsyncStorage). <Text style={styles.bold}>No data is transmitted to any server, cloud service, or third party.</Text> We have no access to your information.
                </Section>

                <Section title="Permissions" isDark={isDark}>
                    The app may request the following device permissions:{'\n\n'}
                    • <Text style={styles.bold}>Photo Library</Text> — to let you set a profile picture. Only used when you actively choose to pick a photo.{'\n'}
                    • <Text style={styles.bold}>Camera</Text> — to let you take a new profile photo directly.{'\n'}
                    • <Text style={styles.bold}>Notifications</Text> — to send a daily reminder at 9 AM. You can turn this off at any time in your profile settings or in the iOS Settings app.{'\n\n'}
                    All permissions are optional. The core features of the app work without granting any of them.
                </Section>

                <Section title="Third-Party Services" isDark={isDark}>
                    Daily Impact does not use any third-party analytics, advertising, tracking, or crash reporting services. No data about your usage is shared with anyone.
                </Section>

                <Section title="Children's Privacy" isDark={isDark}>
                    The app does not knowingly collect information from children under the age of 13. If you believe a child has provided personal information through the app, please contact us so we can delete it.
                </Section>

                <Section title="Deleting Your Data" isDark={isDark}>
                    Because all data is stored locally on your device, you can delete it completely at any time by uninstalling the app. This permanently removes all profile information, history, and preferences.
                </Section>

                <Section title="Changes to This Policy" isDark={isDark}>
                    If this privacy policy changes in a material way, we will update the "last updated" date at the top of this page and, where appropriate, notify you within the app.
                </Section>

                <Section title="Contact" isDark={isDark}>
                    Questions about this policy? Reach out at:{'\n\n'}
                    <Text style={[styles.bold, styles.email]}>hello@dailyimpact.app</Text>
                </Section>

                <View style={styles.footer}>
                    <Text style={[styles.footerText, isDark && styles.mutedDark]}>
                        Daily Impact · Made with care for the planet 🌍
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

function Section({ title, children, isDark }: { title: string; children: React.ReactNode; isDark: boolean }) {
    return (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, isDark && styles.textDark]}>{title}</Text>
            <Text style={[styles.body, isDark && styles.bodyDark]}>{children}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
    },
    containerDark: {
        backgroundColor: '#000',
    },
    backButton: {
        paddingHorizontal: 8,
    },
    content: {
        padding: 20,
        paddingBottom: 48,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1C1C1E',
        marginBottom: 4,
    },
    updated: {
        fontSize: 13,
        color: '#8E8E93',
        marginBottom: 28,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1C1C1E',
        marginBottom: 8,
    },
    body: {
        fontSize: 15,
        lineHeight: 23,
        color: '#3C3C43',
    },
    bodyDark: {
        color: '#EBEBF5',
    },
    bold: {
        fontWeight: '700',
    },
    email: {
        color: '#3F7E44',
    },
    footer: {
        marginTop: 16,
        alignItems: 'center',
        paddingTop: 20,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#C6C6C8',
    },
    footerText: {
        fontSize: 13,
        color: '#8E8E93',
    },
    textDark: {
        color: '#fff',
    },
    mutedDark: {
        color: '#636366',
    },
});
