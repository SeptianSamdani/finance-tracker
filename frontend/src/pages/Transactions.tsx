import Layout from '../components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export default function Transactions() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Transactions</h2>
          <p className="text-slate-600 mt-1">Manage your income and expenses</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
            <CardDescription>View and manage all your transactions</CardDescription>
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