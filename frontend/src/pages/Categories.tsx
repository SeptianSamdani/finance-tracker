import Layout from '../components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export default function Categories() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Categories</h2>
          <p className="text-slate-600 mt-1">Organize your transactions with categories</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Categories</CardTitle>
            <CardDescription>Manage income and expense categories</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-slate-500 py-8">
              Coming soon... 🚧
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}